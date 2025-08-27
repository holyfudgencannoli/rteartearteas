import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceiptPreview from '../components/ReceiptPreview';
import TransactionFromReceiptForm from '../components/TransactionFromReceiptForm';
import './FinalizeReceipt.css';
import { Switch } from '@mui/joy';
import getCookie from '../components/CookieGetter';

const FinalizeReceipt = () => {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const navigate = useNavigate();

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- new: call LM Studio directly
  const sendToLmStudio = async (file) => {
    const csrfToken = getCookie('csrf_token')
    const base64 = await fileToBase64(file);

    const schema = {
      type: "object",
      properties: {
        store: { type: "string" },
        address: { type: "string" },
        datetime: { type: "string" },
        total: { type: "number" },
        payment: { type: "string" }
      },
      required: ["store", "address", "datetime", "items", "total", "payment"]
    };

    
    const res = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        model: "gemma-3-4b-it-qat", // change to your LM Studio model
        messages: [
          {
            role: "system",
            content: "Extract structured receipt data as JSON."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract receipt data and output ONLY valid JSON. Do not worry about items, only receipt metadata. Do NOT include any extra text." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "receipt_schema",
            schema: schema
          }
        }
      })
    });

    if (!res.ok) throw new Error("LM Studio request failed");

    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  };

  useEffect(() => {
    const processFile = async () => {
      const fileDataJson = sessionStorage.getItem("uploadedReceipt");
      if (!fileDataJson) {
        navigate("/", credentials='include');
        return;
      }

      setFileData(fileDataJson);
      const fileDataParsed = JSON.parse(fileDataJson);

      const res = await fetch(fileDataParsed.dataUrl);
      const blob = await res.blob();
      const reconstructedFile = new File([blob], fileDataParsed.name, { type: fileDataParsed.type });
      setFile(reconstructedFile);

      try {
        const data = await sendToLmStudio(reconstructedFile);
        setReceiptData(data);
      } catch (err) {
        console.error("LM Studio extraction failed:", err);
      }
    };

    processFile();
  }, [navigate]);

  if (!file) return <p className="p-4">Loading receipt...</p>;

  return (
    <div className="container">
      <div className="inline-container">
        <div className="preview-box">
          <ReceiptPreview file={file} />
          <div>
            <h1>Receipt Data</h1>
            <pre>{receiptData ? JSON.stringify(receiptData, null, 2) : "Processing..."}</pre>
            <h2>Total: {receiptData?.total}</h2>
            <h2>Date: {receiptData?.date}</h2>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Switch
            variant="solid"
            id="isNewCheckbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
        </div>

        <div className="form-box">
          <TransactionFromReceiptForm file={file} receiptData={receiptData} />
        </div>
      </div>
    </div>
  );
};

export default FinalizeReceipt;

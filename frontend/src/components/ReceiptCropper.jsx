import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button, Box, Slider } from "@mui/material";
import ReceiptSelect from "./ReceiptSelect";
import getCookie from "./CookieGetter";

function getCroppedImg(imageSrc, croppedAreaPixels) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        console.debug("[getCroppedImg] Blob created:", blob);
        resolve(blob);
      }, "image/jpeg");
    };
  });
}

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const sendToLmStudio = async (file) => {
    const csrfToken = getCookie('csrf_token')
    const base64 = await fileToBase64(file);

    const schema = {
        type: "object",
        properties: {
            item: {
                type: "object", // ✅ define type
                    properties: {
                        name: { type: "string" },
                        price: { type: "number" },
                        quantity: { type: "number" },
                        sku: { type: "string" },
                    },
                required: ["name", "price", "quantity", "sku"]
            }
        },
        required: ["item"]
    };

    const res = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
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
              { type: "text", text: "Extract receipt item line data & output ONLY valid JSON. There is only one item in the image with price, name, & possibly quantity & sku. Do NOT include any extra text. " },
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

    console.debug("Server response status:", res.status);
    
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  };



export default function ReceiptLineCropper() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropHeight, setCropHeight] = useState(15);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    console.debug("[onCropComplete] Cropped pixels:", croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.debug("[handleFileUpload] File selected:", {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
      });
      const reader = new FileReader();
      reader.onload = () => {
        console.debug("[handleFileUpload] File loaded as DataURL");
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) {
      console.warn("[handleCrop] No image or cropped area available");
      return;
    }

    console.debug("[handleCrop] Cropping with pixels:", croppedAreaPixels);
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels);

    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped.jpg");

    console.debug("[handleCrop] Sending request to:", "http://localhost:1234/v1/receipts");
    alert("sending cropped image to server")
    console.debug("[handleCrop] FormData:", formData.get("file"));

        try {   
            const data = await sendToLmStudio(croppedBlob)
            console.debug("[handleCrop] Server response JSON:", data)
            alert("✅ Cropped line sent to AI server!");
        } catch (err) {
            console.error("[handleCrop] Upload failed:", err);
            alert("❌ Upload failed, check console for details");
        }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ReceiptSelect /> 
      <input type="file" accept="image/*" onChange={handleFileUpload} />

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, sm: 250, md: 300 },
          mt: 2,
          borderRadius: 2,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={100 / parseInt(cropHeight)}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={false}
            objectFit="horizontal-cover"
          />
        )}
      </Box>

      {image && (
        <Box sx={{ mb: 2 }}>
          <Slider
            value={cropHeight}
            min={5}
            max={40}
            step={1}
            onChange={(_, v) => setCropHeight(v)}
            valueLabelDisplay="auto"
            aria-label="Crop height"
          />
        </Box>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleCrop}
        sx={{ mt: 2 }}
      >
        Send Cropped Line
      </Button>
    </Box>
  );
}

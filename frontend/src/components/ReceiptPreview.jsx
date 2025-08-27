import React, { useEffect, useState } from 'react';


const ReceiptPreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null); // No preview for PDF
    }
  }, [file]);

  if (!file) return null;



  return (
    <div>
      <h3>Receipt Preview</h3>
      {file.type.startsWith('image/') ? (
        <img
          src={previewUrl}
          alt="Receipt Preview"
          style={{ maxWidth: '360px', maxHeight: '720px', objectFit: 'contain' }}
        />
      ) : (
        <p>
          PDF uploaded: <strong>{file.name}</strong>
          <br />
          <a
            href={URL.createObjectURL(file)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
        </p>
      )}
    </div>
  );
};

export default ReceiptPreview;

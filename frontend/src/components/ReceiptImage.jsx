import React from 'react';

const ReceiptImage = ({ receiptId }) => {
  if (!receiptId) return null;

  const url = `http://localhost:5000/api/receipt_file/${receiptId}`;

  return (
    <img
      src={url}
      alt="Receipt"
      style={{ maxWidth: '400px', maxHeight: '300px', objectFit: 'contain' }}
    />
  );
};

export default ReceiptImage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@mui/joy';
  
const ReceiptUploader = () => {
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPEG, or PNG files are allowed.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        dataUrl: reader.result,  // base64 with data url prefix
      };

      sessionStorage.setItem('uploadedReceipt', JSON.stringify(fileData));
      navigate('/finalize-receipt');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div id='upload-cont' className="p-4">
      <label><h2 style={{color: '#000'}}>Upload New Receipt:</h2></label><br />
      <h3 style={{color: '#000'}}>Make sure to include the whole receipt for total accuracy</h3>
      <Input 
        sx={{ width:'66.6%' }}
        style = {{ marginBottom:'3rem' }}
        type="file"
        accept=".pdf,image/jpeg,image/png"
        onChange={handleFileChange}
        className="mb-4"
        variant='soft'
      />
    </div>
  );
};

export default ReceiptUploader;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@mui/joy';
import getCookie from './CookieGetter';

const TransactionFromReceiptForm = ({ file, receiptData }) => {
  const navigate = useNavigate()

  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [datetime, setDatetime] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [total, setTotal] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    if (receiptData) {
      setStoreName(receiptData.store);
      setStoreAddress(receiptData.location);
      // setDatetime(receiptData.datetime)
      setPaymentType(receiptData.paymentType);
      setTotal(receiptData.total);
    }
  }, [receiptData]);




  async function handleSubmit(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrf_token')
    

    const formData = new FormData();
    formData.append('store_name', storeName);
    formData.append('datetime', datetime);
    formData.append('store_address', storeAddress);
    formData.append('payment_type', paymentType);
    formData.append('total', total);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', file);


    // console.log(formData)
    try {
    const response = await fetch('http://localhost:5000/api/upload-receipt-route', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
    });
    
    const data = await response.json();
      
    if (data.message) {
      console.log('Submitted: ', data)
      console.log(formData)
      alert(data.message)
      navigate('/dashboard');
    } else {
      console.log('Submitted: ', data.error)
      alert('Journal Entry Failed!');
    }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  };  

  return (
    <form
      style={{ backgroundColor: '#aaa', display: 'flex', width: '400px', justifyContent: 'center', flexDirection:'column', alignItems: 'center'}}
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg mt-4 space-y-4"
    >
      <h2 className="font-semibold text-lg">New Transaction</h2>
      <label className="block text-sm font-medium text-gray-700">Store Name:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="storeName"
        value={storeName}
        onChange={e => setStoreName(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />
      <label className="block text-sm font-medium text-gray-700">Store Location:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="storeAddress"
        value={storeAddress}
        onChange={e => setStoreAddress(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />
      <label className="block text-sm font-medium text-gray-700">Date & Time</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="datetime"
        name="datetime"
        value={datetime}
        onChange={e => setDatetime(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
        required
      />
      <label className="block text-sm font-medium text-gray-700">Payment Type:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="paymentType"
        value={paymentType}
        onChange={e => setPaymentType(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />
      <label className="block text-sm font-medium text-gray-700">Total:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="total"
        value={total}
        onChange={e => setTotal(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />
      <label className="block text-sm font-medium text-gray-700">Description:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />
      <label className="block text-sm font-medium text-gray-700">Category:</label>
      <Input
        size='sm'
        style={{ width:'66%' }}
        type="text"
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full mt-1 p-2 border rounded"
      />      

      <Button type="submit">Submit</Button>

    </form>
  );
};

export default TransactionFromReceiptForm;

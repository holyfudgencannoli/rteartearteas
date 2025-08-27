import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

export default function ({ name, value, onChange }) {

  const [receipts, setReceipts] = useState([])

  const all_receipts = fetch('')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setReceipts(data)
    })
    .catch(error => {
      console.error('Fetch error: ', error);
    })

  return (
    <Box sx={{ width:'66%' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="receipt-select"
          value={value}
          label="Age"
          name={name}
          onChange={onChange}
        >
          {receipts.map(receipt => {
            <MenuItem key={index} value={receipt.name} />

            })
          }

        </Select>
      </FormControl>
    </Box>
  );
}

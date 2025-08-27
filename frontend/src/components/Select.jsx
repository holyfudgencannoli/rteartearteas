import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ name, value, onChange }) {

  return (
    <Box sx={{ width:'66%' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Age"
          name={name}
          onChange={onChange}
        >
          <MenuItem value={'Debit'}>Debit</MenuItem>
          <MenuItem value={'Credit'}>Credit</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

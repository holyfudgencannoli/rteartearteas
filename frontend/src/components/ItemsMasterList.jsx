import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
    {"id": 0, "store_name": "FreshMart Grocery", "date": "2025-08-18", "name": "Bananas", "price": 0.59},
    {"id": 1, "store_name": "FreshMart Grocery", "date": "2025-08-18", "name": "Milk 1L", "price": 2.49},
    {"id": 2, "store_name": "FreshMart Grocery", "date": "2025-08-18", "name": "Whole Wheat Bread", "price": 3.29},
    {"id": 3, "store_name": "FreshMart Grocery", "date": "2025-08-18", "name": "Eggs Dozen", "price": 2.99},
    {"id": 4, "store_name": "FreshMart Grocery", "date": "2025-08-18", "name": "Cheddar Cheese 200g", "price": 4.50},
    {"id": 5, "store_name": "GreenLeaf Market", "date": "2025-08-19", "name": "Apples 1kg", "price": 4.20},
    {"id": 6, "store_name": "GreenLeaf Market", "date": "2025-08-19", "name": "Orange Juice 1L", "price": 3.99},
    {"id": 7, "store_name": "GreenLeaf Market", "date": "2025-08-19", "name": "Yogurt 500g", "price": 2.99},
    {"id": 8, "store_name": "GreenLeaf Market", "date": "2025-08-19", "name": "Spinach 200g", "price": 3.50},
    {"id": 9, "store_name": "GreenLeaf Market", "date": "2025-08-19", "name": "Almond Milk 1L", "price": 3.79},
    {"id": 10, "store_name": "DailyFresh Groceries", "date": "2025-08-17", "name": "Bag of Rice 2kg", "price": 7.49},
    {"id": 11, "store_name": "DailyFresh Groceries", "date": "2025-08-17", "name": "Chicken Breast 1kg", "price": 6.99},
    {"id": 12, "store_name": "DailyFresh Groceries", "date": "2025-08-17", "name": "Broccoli 500g", "price": 2.49},
    {"id": 13, "store_name": "DailyFresh Groceries", "date": "2025-08-17", "name": "Carrots 1kg", "price": 1.99},
    {"id": 14, "store_name": "DailyFresh Groceries", "date": "2025-08-17", "name": "Eggs Dozen", "price": 2.99},
    {"id": 15, "store_name": "Nature's Basket", "date": "2025-08-15", "name": "Organic Tomatoes 500g", "price": 4.99},
    {"id": 16, "store_name": "Nature's Basket", "date": "2025-08-15", "name": "Cucumber 1kg", "price": 2.49},
    {"id": 17, "store_name": "Nature's Basket", "date": "2025-08-15", "name": "Olive Oil 500ml", "price": 8.99},
    {"id": 18, "store_name": "Nature's Basket", "date": "2025-08-15", "name": "Whole Wheat Bread", "price": 3.29},
    {"id": 19, "store_name": "Nature's Basket", "date": "2025-08-15", "name": "Milk 1L", "price": 2.49},
    {"id": 20, "store_name": "Healthy Harvest", "date": "2025-08-16", "name": "Bananas", "price": 0.59},
    {"id": 21, "store_name": "Healthy Harvest", "date": "2025-08-16", "name": "Almonds 200g", "price": 5.49},
    {"id": 22, "store_name": "Healthy Harvest", "date": "2025-08-16", "name": "Orange Juice 1L", "price": 3.99},
    {"id": 23, "store_name": "Healthy Harvest", "date": "2025-08-16", "name": "Eggs Dozen", "price": 2.99},
    {"id": 24, "store_name": "Healthy Harvest", "date": "2025-08-16", "name": "Cheddar Cheese 200g", "price": 4.50},
    {"id": 25, "store_name": "UrbanGrocer", "date": "2025-08-20", "name": "Apples 1kg", "price": 4.20},
    {"id": 26, "store_name": "UrbanGrocer", "date": "2025-08-20", "name": "Bananas", "price": 0.59},
    {"id": 27, "store_name": "UrbanGrocer", "date": "2025-08-20", "name": "Milk 1L", "price": 2.49},
    {"id": 28, "store_name": "UrbanGrocer", "date": "2025-08-20", "name": "Brown Bread", "price": 3.29},
    {"id": 29, "store_name": "UrbanGrocer", "date": "2025-08-20", "name": "Eggs Dozen", "price": 2.99},
    {"id": 30, "store_name": "FreshChoice Market", "date": "2025-08-14", "name": "Spinach 200g", "price": 3.50},
    {"id": 31, "store_name": "FreshChoice Market", "date": "2025-08-14", "name": "Tomatoes 500g", "price": 2.99},
    {"id": 32, "store_name": "FreshChoice Market", "date": "2025-08-14", "name": "Cucumber 1kg", "price": 2.49},
    {"id": 33, "store_name": "FreshChoice Market", "date": "2025-08-14", "name": "Carrots 1kg", "price": 1.99},
    {"id": 34, "store_name": "FreshChoice Market", "date": "2025-08-14", "name": "Milk 1L", "price": 2.49},
    {"id": 35, "store_name": "Green Valley Groceries", "date": "2025-08-13", "name": "Bananas", "price": 0.59},
    {"id": 36, "store_name": "Green Valley Groceries", "date": "2025-08-13", "name": "Apples 1kg", "price": 4.20},
    {"id": 37, "store_name": "Green Valley Groceries", "date": "2025-08-13", "name": "Orange Juice 1L", "price": 3.99},
    {"id": 38, "store_name": "Green Valley Groceries", "date": "2025-08-13", "name": "Whole Wheat Bread", "price": 3.29},
    {"id": 39, "store_name": "Green Valley Groceries", "date": "2025-08-13", "name": "Eggs Dozen", "price": 2.99},
    {"id": 40, "store_name": "Sunrise Supermarket", "date": "2025-08-12", "name": "Milk 1L", "price": 2.49},
    {"id": 41, "store_name": "Sunrise Supermarket", "date": "2025-08-12", "name": "Eggs Dozen", "price": 2.99},
    {"id": 42, "store_name": "Sunrise Supermarket", "date": "2025-08-12", "name": "Bananas", "price": 0.59},
    {"id": 43, "store_name": "Sunrise Supermarket", "date": "2025-08-12", "name": "Tomatoes 500g", "price": 2.99},
    {"id": 44, "store_name": "Sunrise Supermarket", "date": "2025-08-12", "name": "Bread Loaf", "price": 3.29},
    {"id": 45, "store_name": "NatureFresh Grocers", "date": "2025-08-11", "name": "Carrots 1kg", "price": 1.99},
    {"id": 46, "store_name": "NatureFresh Grocers", "date": "2025-08-11", "name": "Potatoes 2kg", "price": 3.49},
    {"id": 47, "store_name": "NatureFresh Grocers", "date": "2025-08-11", "name": "Spinach 200g", "price": 3.50},
    {"id": 48, "store_name": "NatureFresh Grocers", "date": "2025-08-11", "name": "Almond Milk 1L", "price": 3.79},
    {"id": 49, "store_name": "NatureFresh Grocers", "date": "2025-08-11", "name": "Eggs Dozen", "price": 2.99}
].map(row => ({ ...row, date: new Date(row.date).toISOString() })); 


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'store_name', headerName: 'Store Name', width: 150, editable: true },
  { 
    field: 'date', 
    headerName: 'Date', 
    type: 'date', 
    width: 150, 
    editable: true,
    valueFormatter: (params) => params.value ? params.value.toLocaleDateString('en-US') : ''
  },
  { field: 'name', headerName: 'Item Name', width: 180, editable: true },
  { 
    field: 'price', 
    headerName: 'Price', 
    type: 'number', 
    width: 120,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('en-US'); // MM/DD/YYYY
    }
  },
];

export default function ReceiptsGrid() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
import UploadReceipt from "../pages/UploadReceipt";
import SimpleLineChart from "./Line";
import BasicArea from "./DailySpending";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DailySpending from "./DailySpending";
import ItemsMasterList from "./ItemsMasterList";
import ItemsByStoreList from "./ItemsByStoreList";
import { useEffect, useState } from "react";
import SimpleSlider from "./Carousel";
import SeasonalSpending from "./SeasonalSpending";
import './Dashboard.css'
import WeeklySpending from "./WeeklySpending";
import MonthlySpending from "./MonthlySpending";
import SpendingByStore from "./SpendingByStore";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));




export default function Dashboard({ sessionToken, userId }) {

    const [receipts, setReceipts] = useState([])
    const [Token, setToken] = useState(sessionToken)
    const [user, setUser] = useState(userId)
    
    useEffect(() => {
        fetch('/api/receipts-archive', {method: 'GET', credentials: 'include'})
        .then(res => {
            if(!res.ok) {
                throw new Error('Failed to fetch receipts')
            }
            if (res.status === 401) {
                window.location.href = '/login';
            } else {
                return res.json()
            }
        })
        .then(data => {
            if (!data.receipt_data_objects) {
                alert("No receipts found!");
            } else {
                setReceipts(data.receipt_data_objects);
            }
        })
        .catch(err => {
            console.error("Error fetching receipts:", err);
            alert("Error loading receipts");
        })
    }, [])

  return (
    <div>
        <h1>Dashboard</h1>
        {receipts.length === 0 ? (
        <>
            <h3>Start by uploading your first receipt!</h3>
            <UploadReceipt  state={{ sessionToken: data.token, userId: data.user_id}} />
        </>
        ) : (
        <></>
        )} 
        <Box sx={{ flexGrow: 1, margin: '4rem' }}>
            <Grid container spacing={8}>
                <Grid size={6}>
                    <Item>
                        <SimpleSlider />
                    </Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <SeasonalSpending />
                    </Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <SimpleSlider />
                    </Item>
                </Grid>
                <Grid size={6}>
                    <Item>
                        <SeasonalSpending />
                    </Item>
                </Grid>
                <Grid size={{ xs:12, sm: 12, md: 6, lg: 6  }}>
                    <Item>
                        <WeeklySpending />
                    </Item>
                </Grid>
                <Grid size={{ xs:12, sm: 12, md: 6, lg: 6  }}>
                    <Item>
                        <MonthlySpending />
                    </Item>
                </Grid>
                <Grid size={{ xs:12, sm: 12, md: 6, lg: 12  }}>
                    <Item>
                        <SpendingByStore />
                    </Item>
                </Grid>
            </Grid>
        </Box>
        
    </div>
  );
}

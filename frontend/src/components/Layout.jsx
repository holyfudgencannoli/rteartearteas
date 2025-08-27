import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import '../App.css'
import NavDrawer from './NavDrawer'

function Layout() {
  const [message, setMessage] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")



  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000); // update every second

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  useEffect(() => {
    return setDate(TodayDate());
  }, []);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function TodayDate() {
    const today = new Date()
    return today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  useEffect(() => {
    console.log('Fetching from backend...');

    fetch('https://test2-1vbv.onrender.com/api/name')
      .then(res => {
        console.log('Raw response:', res);
        return res.json();
      })
      .then(data => {
        console.log('Parsed JSON:', data);
        setMessage(data.message);
      })
      .catch(err => {
        console.error('Error fetching:', err);
      });
    }, []);

  return (
    <div id="app-container">
        <header>
            <div id='header'>
                <NavDrawer />
                <h3 id='date'>{date}</h3>
                <h3 id='time'>{time}</h3>
            </div>
        </header>
        <main id='main-content'>
            <h1 id='title'>{message}</h1>
            <div>
                {/* <input type='text'></input> */}
            </div>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout



// Action Categories for a Bookkeeping AI Router
// 1. Transaction Management

// Categorize a transaction — classify existing transaction(s) into a chart of accounts.

// Create a new transaction — from a chat message and optional receipt.

// Edit a transaction — change amount, vendor, category, date, notes.

// Delete a transaction — remove from records.

// Search transactions — find by vendor, date, category, amount range.

// 2. Receipt & Document Handling

// Attach a receipt to a transaction — link uploaded receipt to an existing transaction.

// Extract data from receipt — OCR text and parse into structured info.

// Match receipt to transaction — find best match in recent transactions.

// 3. Reporting & Analysis

// Generate a summary report — e.g., “Show me expenses for July” or “How much revenue did we have last quarter?”

// Compare periods — “Compare this month’s travel expenses to last month.”

// Detect anomalies — find unusual or suspicious transactions.

// Budget tracking — “How am I doing on my office supplies budget this quarter?”

// 4. Navigation / UI Control

// Navigate to page — “Show me invoices,” “Open expense report,” “Go to bank feeds.”

// Link to page — provide a clickable link to a specific filtered view.

// Change UI filter — “Show only uncategorized transactions from last week.”

// 5. Account & Settings Management

// Connect a bank account — start onboarding for a financial institution.

// Manage chart of accounts — add, remove, or rename categories.

// User settings changes — update profile, preferences, currency settings.

// 6. Automation & Bulk Actions

// Bulk categorize transactions — apply AI/rules to multiple at once.

// Undo categorization — revert AI’s changes.

// Set up rules — “Always categorize Publix as Groceries.”

// 7. Help & Guidance

// Explain a transaction — “Why did you categorize this as Meals?”

// Explain a report — “How did you calculate this number?”

// General help — how to use a feature.
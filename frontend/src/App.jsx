import { Route, Routes } from 'react-router-dom';
import UploadReceipt from "./pages/UploadReceipt.jsx";
import FinalizeReceipt from "./pages/FinalizeReceipt.jsx";
import Layout from "./components/Layout.jsx";
import './App.css' 
import './index.css'
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx';
import Home from './pages/Home.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import ReceiptCropper from './components/ReceiptCropper.jsx';
import ReceiptList from './components/ReceiptList.jsx';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin-panel' element={<AdminPanel />} />
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/upload-receipt" element={<UploadReceipt />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/finalize-receipt" element={<FinalizeReceipt />}></Route>
        <Route path="/rc" element={<ReceiptCropper />}></Route>
        <Route path='/rl' element={<ReceiptList />} />
        {/* <Route path="/account-details/:account_id" element={<AccountDetails />}></Route> */}
      </Route>
    </Routes>
  )
}

export default App



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
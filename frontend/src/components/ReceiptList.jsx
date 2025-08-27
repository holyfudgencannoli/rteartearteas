import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error);
    console.error("React component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ReceiptList() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetch('/api/receipts-archive')
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch receipts");
        }
        return res.json();
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
      });
  }, []);

  const rows = receipts;

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Store</StyledTableCell>
              <StyledTableCell align="right">Datetime</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">Receipt URL</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.store_name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.datetime}</StyledTableCell>
                <StyledTableCell align="right">{row.total}</StyledTableCell>
                <StyledTableCell align="right">
                  <a href={row.receipt_path}>click for receipt</a>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ErrorBoundary>
  );
}

import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/joy';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import './NavDrawer.css'
import LogoutButton from './LogoutButton';

export default function NavDrawer() {
  const [open, setOpen] = React.useState(false);

  const pathname = window.location.pathname
  const startPaths = ['/', '/login', '/signup']
  const is_home = startPaths.includes(pathname) ? "none" : "block";





  return (
    <React.Fragment>
      <IconButton id='NavToggle' style={{ display: is_home }} variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        <Menu />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
           content: {
            sx: {
              bgcolor: 'black',
              p: 2,
              width: 280, // control drawer width
            },
          },
          backdrop: {
            sx: { backgroundColor: 'rgba(0,0,0,0.6)' }, // darker overlay
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 'auto',
            mt: 1,
            mr: 2,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            sx={{ color:'white', fontSize: 'sm', fontWeight: 'lg', cursor: 'pointer' }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: 'initial' }} />
        </Box>
        <List
          size="lg"
          component="nav"
          sx={{
            '& .MuiListItemButton-root': {
              bgcolor: 'black',
              color: 'white',
              borderRadius: 'sm',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
              },
            },
            flex: 'none',
            fontSize: 'xl',
            '& > div': { justifyContent: 'center' },
          }}
        >
           
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/dashboard"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Home</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/upload-receipt"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Upload A Receipt</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/add-account"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Add A New Account</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/add-an-entry"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Add A Journal Entry</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/transactions"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Transaction Entries</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/coa"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Chart Of Accounts</Link></ListItemButton>
          <ListItemButton ><Link onClick={() => setOpen(false)} component={RouterLink} to={"/account-ledger"} sx={{ fontSize:'xl', fontWeight:'lg' }} style={{ textDecoration: 'none', color: 'inherit', justifyContent: 'center'}} >Account Ledger</Link></ListItemButton>
        </List>
        <LogoutButton setOpen={setOpen} />
      </Drawer>
    </React.Fragment>
  );
}

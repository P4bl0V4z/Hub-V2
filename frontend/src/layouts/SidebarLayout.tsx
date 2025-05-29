import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Box, Drawer, Toolbar, Typography, List, ListItem, ListItemText, AppBar, Button } from '@mui/material';
import logo from '../img/beloop.png';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/api/auth/check', { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
        </Toolbar>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 1 }}>
          {isAuthenticated ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button component={Link} to="/login">Login</Button>
              <Button component={Link} to="/register">Register</Button>
            </>
          )}
        </AppBar>
        <Outlet />
      </Box>
    </Box>
  );
}
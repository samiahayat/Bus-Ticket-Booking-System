import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Menu, MenuItem, Avatar, Divider
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = useState(null);

  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  if (isLoginPage) return null;

  // Show back button on any page except home
  const showBack = location.pathname !== '/' && 
                 location.pathname !== '/login' && 
                 location.pathname !== '/register';

  const handleLogout = () => {
    setAnchor(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        color: 'text.primary',
        py: 0, // Removed padding
      }}
    >
      <Toolbar 
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          width: '100%', 
          px: { xs: 2, md: 4 },
          minHeight: { xs: '56px', sm: '60px' }, // Reduced height
          py: { xs: 0.5, sm: 0 } // Minimal padding
        }}
      >
        {/* Back Button */}
        {showBack && (
          <IconButton 
            onClick={() => {
              if (location.pathname.startsWith('/schedule/')) {
                navigate('/results' + location.search || '/');
              } else if (location.pathname === '/results') {
                navigate('/');
              } else if (location.pathname === '/my-bookings') {
                navigate('/');
              } else if (location.pathname.startsWith('/admin')) {
                navigate('/');
              } else {
                navigate('/');
              }
            }} 
            sx={{
              mr: 1.5, 
              color: 'primary.main',
              background: '#e3f2fd',
              '&:hover': { background: '#bbdefb' },
              width: 34,
              height: 34,
              '& .MuiSvgIcon-root': { fontSize: 20 } // Smaller icon
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Box 
          component={Link} 
          to="/" 
          sx={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.8, // Reduced gap
            textDecoration: 'none', 
            color: 'primary.main', 
            flexGrow: 1
          }}
        >
          <DirectionsBusIcon sx={{ fontSize: 24 }} /> {/* Smaller icon */}
          <Typography 
            variant="h6" 
            fontWeight={800} 
            color="primary.main"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} // Responsive font
          >
            BusBook
          </Typography>
        </Box>

        {user ? (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Button 
              component={Link} 
              to="/my-bookings"
              startIcon={<ConfirmationNumberIcon />}
              sx={{ 
                color: 'text.primary', 
                display: { xs: 'none', sm: 'flex' },
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 0.5,
                px: 1.5,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              My Bookings
            </Button>

            {user.roles?.includes('Admin') && (
              <Button 
                component={Link} 
                to="/admin"
                startIcon={<DashboardIcon />}
                sx={{ 
                  color: 'text.primary', 
                  display: { xs: 'none', sm: 'flex' },
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  py: 0.5,
                  px: 1.5,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                Admin
              </Button>
            )}

            <IconButton 
              onClick={e => setAnchor(e.currentTarget)} 
              sx={{ 
                ml: 0.5,
                p: 0.5
              }}
            >
              <Avatar sx={{
                width: 32, // Smaller avatar
                height: 32,
                background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)',
                fontSize: 13, 
                fontWeight: 700
              }}>
                {user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>

            <Menu 
              anchorEl={anchor} 
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              PaperProps={{ 
                sx: { 
                  borderRadius: 2.5, 
                  minWidth: 200, 
                  mt: 0.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                } 
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight={700} fontSize={13}>
                  {user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize={11}>
                  {user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']}
                </Typography>
              </Box>
              <Divider />
              <MenuItem 
                onClick={() => { navigate('/my-bookings'); setAnchor(null); }}
                sx={{ py: 1, fontSize: 14 }}
              >
                <ConfirmationNumberIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', fontSize: 18 }} />
                My Bookings
              </MenuItem>
              {user.roles?.includes('Admin') && (
                <MenuItem 
                  onClick={() => { navigate('/admin'); setAnchor(null); }}
                  sx={{ py: 1, fontSize: 14 }}
                >
                  <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', fontSize: 18 }} />
                  Admin Panel
                </MenuItem>
              )}
              <Divider />
              <MenuItem 
                onClick={handleLogout} 
                sx={{ color: 'error.main', py: 1, fontSize: 14 }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1.5, fontSize: 18 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button 
              component={Link} 
              to="/login" 
              sx={{ 
                color: 'text.primary',
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 0.5,
                px: 1.5
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained"
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 0.5,
                px: 2,
                background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  background: 'linear-gradient(135deg, #0a3a62, #0f4c81)'
                }
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, TextField, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Try admin@busbook.com / Admin@123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0f4c81 0%, #1565c0 50%, #0d47a1 100%)',
    }}>
      {/* Left Panel */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', p: 6, color: 'white'
      }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <DirectionsBusIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
          <Typography variant="h3" fontWeight={800} mb={2}>BusBook</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 340, lineHeight: 1.7 }}>
            Pakistan's most reliable bus ticket booking platform. Travel comfortably, book instantly.
          </Typography>
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['Lahore → Karachi', 'Islamabad → Peshawar', 'Multan → Faisalabad'].map((route, i) => (
              <motion.div key={route} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  background: 'rgba(255,255,255,0.1)', borderRadius: 3,
                  px: 3, py: 1.5, backdropFilter: 'blur(10px)'
                }}>
                  <DirectionsBusIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{route}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Right Panel - Login Form */}
      <Box sx={{
        width: { xs: '100%', md: '460px' },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'white', p: 4,
        borderRadius: { md: '24px 0 0 24px' },
      }}>
        <motion.div style={{ width: '100%', maxWidth: 380 }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} color="primary.main" mb={1}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Sign in to book your next journey
            </Typography>
          </Box>

          {error && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" type="email"
              value={form.email} sx={{ mb: 2.5 }}
              onChange={e => setForm({ ...form, email: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>
              }}
            />
            <TextField
              fullWidth label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password} sx={{ mb: 3 }}
              onChange={e => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant="contained" size="large" type="submit"
              disabled={loading} sx={{ mb: 3, py: 1.5 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{
            p: 2.5, background: '#f0f7ff', borderRadius: 3,
            border: '1px solid #b3d4f5', mb: 3
          }}>
            <Typography variant="body2" color="primary" fontWeight={600} mb={1}>
              Demo Credentials
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Admin: admin@busbook.com / Admin@123
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              User: user@busbook.com / User@123
            </Typography>
          </Box>

          <Typography textAlign="center" variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0f4c81', fontWeight: 600 }}>
              Create one free
            </Link>
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
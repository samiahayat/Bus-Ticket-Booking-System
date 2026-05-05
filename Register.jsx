import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, Card, CardContent,
  TextField, Typography, Alert
} from '@mui/material';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', form);
      navigate('/login');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card elevation={3} sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
            Register
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name"
              value={form.fullName} sx={{ mb: 2 }}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
            <TextField
              fullWidth label="Email" type="email"
              value={form.email} sx={{ mb: 2 }}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              fullWidth label="Password" type="password"
              value={form.password} sx={{ mb: 3 }}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <Button
              fullWidth variant="contained" size="large"
              type="submit" disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Typography textAlign="center" mt={2} variant="body2">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
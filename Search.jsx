import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, TextField,
  Typography, Grid, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const POPULAR_ROUTES = [
  { from: 'Lahore',     to: 'Karachi'    },
  { from: 'Islamabad',  to: 'Lahore'     },
  { from: 'Karachi',    to: 'Islamabad'  },
  { from: 'Lahore',     to: 'Multan'     },
  { from: 'Islamabad',  to: 'Peshawar'   },
  { from: 'Lahore',     to: 'Faisalabad' },
  { from: 'Karachi',    to: 'Quetta'     },
  { from: 'Peshawar',   to: 'Lahore'     },
];

export default function Search() {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!form.from || !form.to || !form.date) {
      alert('Please fill all fields');
      return;
    }
    navigate(
      `/results?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&date=${form.date}`
    );
  };

  const swapCities = () =>
    setForm(f => ({ ...f, from: f.to, to: f.from }));

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f4f8' }}>

      {/* ── Hero ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1565c0 100%)',
        pt: 8, pb: 10, px: 3,
        position: 'relative', overflow: 'hidden'
      }}>
        {/* decorative circles */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute', bottom: -100, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none'
        }} />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3" color="white" fontWeight={800}
            textAlign="center" mb={1}
          >
            Where are you headed?
          </Typography>
          <Typography
            color="rgba(255,255,255,0.75)" textAlign="center"
            mb={5} variant="h6" fontWeight={400}
          >
            Book bus tickets across Pakistan instantly
          </Typography>
        </motion.div>

        {/* ── Search Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card sx={{
            maxWidth: 900, mx: 'auto',
            p: { xs: 2, md: 3.5 },
            position: 'relative', zIndex: 1
          }}>
            <Grid container spacing={2} alignItems="center">

              {/* From */}
              <Grid item xs={12} sm={3.5}>
                <TextField
                  fullWidth label="From" placeholder="e.g. Lahore"
                  value={form.from}
                  onChange={e => setForm({ ...form, from: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <LocationOnIcon color="primary" sx={{ mr: 1, flexShrink: 0 }} />
                    )
                  }}
                />
              </Grid>

              {/* Swap button */}
              <Grid item xs={12} sm="auto"
                sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={swapCities}
                  variant="outlined"
                  sx={{
                    minWidth: 44, width: 44, height: 56,
                    p: 0, borderRadius: '50%'
                  }}
                >
                  <SwapHorizIcon />
                </Button>
              </Grid>

              {/* To */}
              <Grid item xs={12} sm={3.5}>
                <TextField
                  fullWidth label="To" placeholder="e.g. Karachi"
                  value={form.to}
                  onChange={e => setForm({ ...form, to: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <LocationOnIcon color="secondary" sx={{ mr: 1, flexShrink: 0 }} />
                    )
                  }}
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  type="date"
                  label="Travel Date"
                  InputLabelProps={{ shrink: true }}
                  value={form.date}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </Grid>

              {/* Search button */}
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleSearch}
                  sx={{ py: 1.9, fontSize: 16 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            {/* Popular Routes */}
            <Box sx={{
              mt: 2.5,
              display: 'flex', flexWrap: 'wrap',
              gap: 1, alignItems: 'center'
            }}>
              <Typography
                variant="caption" color="text.secondary"
                fontWeight={600} mr={0.5}
              >
                Popular:
              </Typography>
              {POPULAR_ROUTES.map(r => (
                <Chip
                  key={`${r.from}-${r.to}`}
                  label={`${r.from} → ${r.to}`}
                  size="small" variant="outlined"
                  onClick={() => setForm(f => ({ ...f, ...r }))}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { background: '#e3f2fd', borderColor: '#1565c0' }
                  }}
                />
              ))}
            </Box>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}
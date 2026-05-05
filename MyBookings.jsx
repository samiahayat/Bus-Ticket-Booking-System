import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography,
  Chip, Button, CircularProgress, Divider,
  Avatar, Grid
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  Confirmed: 'success',
  Pending:   'warning',
  Cancelled: 'error',
  Completed: 'info',
};

const SAMPLE_BOOKINGS = [
  {
    id: 1001,
    bookingReference: 'BKXYZ123',
    status: 'Confirmed',
    totalAmount: 5100,
    schedule: {
      departureTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      route: { origin: 'Lahore', destination: 'Karachi' },
      bus:   { name: 'Daewoo Express', logo: '🟦' },
    },
    seats: ['A1', 'A2'],
  },
  {
    id: 1002,
    bookingReference: 'BKPQR456',
    status: 'Completed',
    totalAmount: 1530,
    schedule: {
      departureTime: new Date(Date.now() - 5 * 86400000).toISOString(),
      route: { origin: 'Islamabad', destination: 'Lahore' },
      bus:   { name: 'Faisal Movers', logo: '🟥' },
    },
    seats: ['C3'],
  },
];

function loadBookings() {
  try {
    const saved = sessionStorage.getItem('mockBookings');
    return saved ? JSON.parse(saved) : SAMPLE_BOOKINGS;
  } catch {
    return SAMPLE_BOOKINGS;
  }
}

function saveBookings(bookings) {
  try {
    sessionStorage.setItem('mockBookings', JSON.stringify(bookings));
  } catch {/* ignore */}
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setBookings(loadBookings());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const updated = bookings.map(b =>
      b.id === id ? { ...b, status: 'Cancelled' } : b
    );
    setBookings(updated);
    saveBookings(updated);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress size={48} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f4f8', pb: 6 }}>

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg,#0f4c81,#1565c0)', py: 3, px: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography color="rgba(255,255,255,0.8)" variant="caption" fontWeight={600}>
            TRAVEL HISTORY
          </Typography>
          <Typography variant="h5" color="white" fontWeight={800} mt={0.5}>
            My Bookings
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" variant="body2">
            {bookings.filter(b => b.status !== 'Cancelled').length} active booking(s)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3, py: 4 }}>

        {bookings.length === 0 && (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <DirectionsBusIcon sx={{ fontSize: 72, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} mb={1}>No bookings yet</Typography>
            <Typography color="text.secondary" mb={3}>
              Book your first bus ticket today!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Search Buses
            </Button>
          </Card>
        )}

        <AnimatePresence>
          {bookings.map((booking, idx) => (
            <motion.div key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: idx * 0.07 }}>

              <Card sx={{ mb: 2.5, border: '1.5px solid #e0e9f5' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Grid container alignItems="flex-start" spacing={2}>

                    {/* Bus Logo */}
                    <Grid item>
                      <Avatar sx={{
                        background: 'linear-gradient(135deg,#0f4c81,#1a6bb5)',
                        width: 48, height: 48, fontSize: 22,
                      }}>
                        {booking.schedule?.bus?.logo || '🚌'}
                      </Avatar>
                    </Grid>

                    {/* Details */}
                    <Grid item xs>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
                        <Typography fontWeight={700} fontSize={15}>
                          {booking.schedule?.bus?.name}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={STATUS_COLORS[booking.status] || 'default'}
                          size="small"
                        />
                      </Box>

                      <Typography color="text.secondary" variant="body2" fontWeight={600}>
                        {booking.schedule?.route?.origin} → {booking.schedule?.route?.destination}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" mt={0.3}>
                        🗓 {new Date(booking.schedule?.departureTime).toLocaleString('en-PK', {
                          weekday: 'short', year: 'numeric', month: 'short',
                          day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </Typography>

                      {booking.seats?.length > 0 && (
                        <Typography variant="body2" color="text.secondary" mt={0.3}>
                          💺 Seats: {booking.seats.join(', ')}
                        </Typography>
                      )}

                      <Divider sx={{ my: 1.5 }} />

                      <Box display="flex" justifyContent="space-between"
                        alignItems="center" flexWrap="wrap" gap={1}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Ref: {booking.bookingReference}
                          </Typography>
                          <Typography fontWeight={800} color="primary" fontSize={17}>
                            PKR {booking.totalAmount?.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1} flexWrap="wrap">
                          {booking.status !== 'Cancelled' && (
                            <>
                              <Button size="small" variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => alert(
                                  `Ticket ${booking.bookingReference} — PDF download available when backend is connected.`
                                )}>
                                Ticket
                              </Button>
                              {booking.status !== 'Completed' && (
                                <Button size="small" variant="outlined" color="error"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleCancel(booking.id)}>
                                  Cancel
                                </Button>
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
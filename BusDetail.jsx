import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Typography,
  Grid, Divider, Alert, TextField, Stepper,
  Step, StepLabel, Modal, IconButton, Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DownloadIcon from '@mui/icons-material/Download';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const STEPS = ['Select Seats', 'Passenger Details', 'Payment', 'Confirmed'];

// ─────────────────────────────────────────────
//  TICKET MODAL COMPONENT
// ─────────────────────────────────────────────
function TicketModal({ open, onClose, bookingDetails }) {
  const { schedule, passenger, selectedSeats, bookingRef, totalPrice, duration } = bookingDetails;
  const seatNumbers = selectedSeats.map(seat => seat.seatNumber || seat).join(', ');
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
      BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' } }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -50 }}
        transition={{ duration: 0.3, type: 'spring', damping: 25 }}
        style={{ position: 'relative', width: '90%', maxWidth: 450, maxHeight: '90vh', overflow: 'auto', outline: 'none' }}
      >
        <Box sx={{ position: 'relative', bgcolor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12, zIndex: 10, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,1)' }, color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ background: 'linear-gradient(135deg, #0f4c81, #1565c0)', py: 3, px: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 56, color: '#4ade80', mb: 1 }} />
           <Typography variant="h6" fontWeight={800} color="white">
  Ticket Confirmed!
</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5, display: 'block' }}>Your e-ticket has been generated</Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#0f4c81', letterSpacing: -0.5 }}>RapidRide</Typography>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>E-Ticket · {schedule?.bus?.name} — {schedule?.bus?.type}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, py: 2, px: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Box textAlign="center" flex={1}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#0f4c81' }}>{schedule?.route?.origin}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(schedule?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{new Date(schedule?.departureTime).toLocaleDateString('en-PK', { year: 'numeric', month: '2-digit', day: '2-digit' })}</Typography>
              </Box>
              <Box textAlign="center" px={1}>
                <Typography variant="h6">→</Typography>
                <Typography variant="caption" color="text.secondary" display="block">{Math.floor(duration)}h {Math.round((duration % 1) * 60)}m</Typography>
              </Box>
              <Box textAlign="center" flex={1}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#f97316' }}>{schedule?.route?.destination}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(schedule?.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10, letterSpacing: 0.5 }}>PASSENGER</Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>{passenger.fullName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10, letterSpacing: 0.5 }}>SEATS</Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>{seatNumbers || '—'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10, letterSpacing: 0.5 }}>AMOUNT PAID</Typography>
                  <Typography variant="body1" fontWeight={800} sx={{ color: '#0f4c81', fontSize: 16 }}>Rs {totalPrice.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10, letterSpacing: 0.5 }}>BUS</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 14 }}>{schedule?.bus?.name}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={1} sx={{ fontSize: 10 }}>BOOKING REFERENCE</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#0f4c81', letterSpacing: 1, fontSize: 18 }}>{bookingRef}</Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ fontSize: 10 }}>Valid for travel only. Non-transferable.</Typography>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <Button fullWidth variant="outlined" size="small" startIcon={<LocalPrintshopIcon />} onClick={() => window.print()} sx={{ borderRadius: 2, textTransform: 'none', py: 1 }}>Print</Button>
              <Button fullWidth variant="contained" size="small" startIcon={<DownloadIcon />} onClick={() => alert('PDF download feature coming soon!')} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#0f4c81', '&:hover': { bgcolor: '#0a3a62' }, py: 1 }}>Download PDF</Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
//  SEAT MAP
// ─────────────────────────────────────────────
function SeatMap({ seats, selectedSeats, onToggle }) {
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) rows.push(seats.slice(i, i + 4));

  const SeatBox = ({ seat }) => {
    if (!seat) return <Box sx={{ width: 44, height: 48 }} />;
    const sel = selectedSeats.some(s => s.id === seat.id);
    const booked = seat.status === 'booked';
    return (
      <Box onClick={() => !booked && onToggle(seat)} title={seat.seatNumber} sx={{
        width: 44, height: 48, borderRadius: '8px 8px 5px 5px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 700, cursor: booked ? 'not-allowed' : 'pointer',
        position: 'relative', background: booked ? '#e5e7eb' : sel ? '#1d4ed8' : '#f0fdf4',
        border: `1.5px solid ${booked ? '#d1d5db' : sel ? '#1d4ed8' : '#4ade80'}`,
        color: booked ? '#9ca3af' : sel ? '#ffffff' : '#166534', transition: 'all 0.15s ease', userSelect: 'none',
        '&::before': { content: '""', position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 28, height: 8, borderRadius: '5px 5px 0 0', background: booked ? '#d1d5db' : sel ? '#1d4ed8' : '#4ade80' },
        '&:hover': booked ? {} : { transform: 'scale(1.08)', boxShadow: sel ? '0 4px 14px rgba(29,78,216,0.35)' : '0 4px 14px rgba(74,222,128,0.35)' }
      }}>
        {seat.seatNumber}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '32px 32px 14px 14px', p: '18px 22px 22px', maxWidth: 300, mx: 'auto' }}>
        <Box sx={{ background: '#dbeafe', borderRadius: '20px 20px 6px 6px', height: 34, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 700, letterSpacing: 1, fontSize: 10 }}>FRONT OF BUS</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: '7px 7px 5px 5px', background: '#fef3c7', border: '1.5px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧑‍✈️</Box>
        </Box>
        <Box sx={{ borderTop: '1px dashed #cbd5e1', mb: 2 }} />
        {rows.map((row, rIdx) => {
          const left = [row[0], row[1]], right = [row[2], row[3]];
          const rowLabel = String.fromCharCode(65 + rIdx);
          return (
            <Box key={rIdx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ minWidth: 16, fontSize: 10, fontWeight: 700, color: '#94a3b8', mr: 0.5 }}>{rowLabel}</Typography>
              <Box sx={{ display: 'flex', gap: '6px' }}><SeatBox seat={left[0]} /><SeatBox seat={left[1]} /></Box>
              <Box sx={{ width: 36, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px dashed #cbd5e1', borderRight: '1px dashed #cbd5e1', mx: 0.5 }}>
                <Typography sx={{ fontSize: 9, color: '#94a3b8', letterSpacing: 0.5, writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>AISLE</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '6px' }}><SeatBox seat={right[0]} /><SeatBox seat={right[1]} /></Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', gap: 2.5, mt: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[{ bg: '#f0fdf4', border: '#4ade80', label: 'Available' }, { bg: '#1d4ed8', border: '#1d4ed8', label: 'Selected' }, { bg: '#e5e7eb', border: '#d1d5db', label: 'Booked' }].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '4px', background: item.bg, border: `1.5px solid ${item.border}` }} />
            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
          </Box>
        ))}
      </Box>
      {selectedSeats.length > 0 && (
        <Box sx={{ mt: 2, mx: 'auto', maxWidth: 300, py: 1, px: 2, background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#1d4ed8', fontWeight: 600 }}>✓ {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected</Typography>
        </Box>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────
//  PASSENGER FORM
// ─────────────────────────────────────────────
function PassengerForm({ passenger, onChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><TextField fullWidth label="Full Name *" placeholder="e.g. Ahmed Ali" value={passenger.fullName} onChange={e => onChange('fullName', e.target.value)} /></Grid>
      <Grid item xs={12}><TextField fullWidth label="Email Address *" type="email" placeholder="e.g. ahmed@email.com" value={passenger.email} onChange={e => onChange('email', e.target.value)} /></Grid>
      <Grid item xs={12}><TextField fullWidth label="Phone Number *" placeholder="e.g. 0300-1234567" value={passenger.phone} onChange={e => onChange('phone', e.target.value)} /></Grid>
    </Grid>
  );
}

// ─────────────────────────────────────────────
//  PAYMENT FORM
// ─────────────────────────────────────────────
function PaymentForm({ payment, onChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)', borderRadius: 3, p: 3, color: 'white', minHeight: 150, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="caption" sx={{ opacity: 0.7 }}>Card Number</Typography>
          <Typography fontSize={18} fontWeight={700} letterSpacing={3} mt={0.5} mb={2}>
            {payment.cardNumber ? payment.cardNumber.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Box><Typography variant="caption" sx={{ opacity: 0.7 }}>Card Holder</Typography><Typography fontWeight={600} fontSize={14}>{payment.cardName || 'YOUR NAME'}</Typography></Box>
            <Box><Typography variant="caption" sx={{ opacity: 0.7 }}>Expires</Typography><Typography fontWeight={600} fontSize={14}>{payment.expiry || 'MM/YY'}</Typography></Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Card Number *" placeholder="1234 5678 9012 3456" value={payment.cardNumber}
          onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 16); onChange('cardNumber', val); }}
          inputProps={{ maxLength: 16, inputMode: 'numeric' }} />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Card Holder Name *" placeholder="Name as on card" value={payment.cardName}
          onChange={e => onChange('cardName', e.target.value)} />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="Expiry (MM/YY) *" placeholder="MM/YY" value={payment.expiry}
          onChange={e => { let val = e.target.value.replace(/\D/g, '').slice(0, 4); if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2); onChange('expiry', val); }}
          inputProps={{ maxLength: 5 }} />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="CVV *" placeholder="•••" type="password" value={payment.cvv}
          onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 3); onChange('cvv', val); }}
          inputProps={{ maxLength: 3 }} />
      </Grid>
    </Grid>
  );
}

// ─────────────────────────────────────────────
//  BEAUTIFUL BOOKING SUMMARY - Shows only after Buy Ticket
// ─────────────────────────────────────────────
function BookingSummary({ schedule, selectedSeats, passenger, totalPrice }) {
  const seatNumbers = selectedSeats.map(seat => seat.seatNumber).join(', ');
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        mb: 2,
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight={800} 
        sx={{ 
          color: '#0f4c81',
          mb: 2.5,
          pb: 1.5,
          borderBottom: '2px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <ConfirmationNumberIcon /> Booking Summary
      </Typography>

      {/* Route Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
          Journey Details
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: '#f1f5f9',
          p: 2,
          borderRadius: 2,
          mt: 1
        }}>
          <Box textAlign="center" flex={1}>
            <LocationOnIcon sx={{ color: '#0f4c81', fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>{schedule?.route?.origin}</Typography>
            <Typography variant="caption" color="text.secondary">Departure</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6">→</Typography>
          </Box>
          <Box textAlign="center" flex={1}>
            <LocationOnIcon sx={{ color: '#f97316', fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>{schedule?.route?.destination}</Typography>
            <Typography variant="caption" color="text.secondary">Arrival</Typography>
          </Box>
        </Box>
      </Box>

      {/* Date and Time */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: '#0f4c81', fontSize: 18 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date(schedule?.departureTime).toLocaleDateString('en-PK', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: '#0f4c81', fontSize: 18 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Departure Time</Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date(schedule?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Bus and Seats */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsBusIcon sx={{ color: '#0f4c81', fontSize: 18 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Bus</Typography>
              <Typography variant="body2" fontWeight={600}>{schedule?.bus?.name}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventSeatIcon sx={{ color: '#0f4c81', fontSize: 18 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Seats</Typography>
              <Typography variant="body2" fontWeight={600}>{seatNumbers || '—'}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Passenger Info */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
          Passenger Details
        </Typography>
        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mt: 1 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Full Name</Typography>
              <Typography variant="body2" fontWeight={600}>{passenger.fullName || '—'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography variant="body2">{passenger.email || '—'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Phone</Typography>
              <Typography variant="body2">{passenger.phone || '—'}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total Amount */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pt: 1
      }}>
        <Typography variant="h6" fontWeight={700}>Total Amount</Typography>
        <Box textAlign="right">
          <Typography variant="h5" fontWeight={800} sx={{ color: '#0f4c81' }}>
            PKR {totalPrice.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Including all taxes and fees
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────
//  GENERATE FALLBACK SEATS
// ─────────────────────────────────────────────
function generateSeats(total = 40) {
  const seats = [];
  const rows = 'ABCDEFGHIJ'.split('');
  let id = 1;
  for (let r = 0; r < Math.ceil(total / 4); r++) {
    for (let c = 1; c <= 4; c++) {
      if (id > total) break;
      seats.push({ id, seatNumber: `${rows[r]}${c}`, status: Math.random() < 0.25 ? 'booked' : 'available' });
      id++;
    }
  }
  return seats;
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function BusDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedSchedule = location.state?.schedule;

  const [schedule, setSchedule] = useState(passedSchedule || null);
  const [seats, setSeats] = useState(passedSchedule?.seats || generateSeats(40));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [passenger, setPassenger] = useState({ fullName: '', email: '', phone: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

  useEffect(() => {
    if (!schedule) {
      setSchedule({
        id: parseInt(id), bus: { name: 'Daewoo Express', type: 'AC', logo: '🟦' },
        route: { origin: 'Lahore', destination: 'Karachi' },
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 14 * 3600000).toISOString(),
        price: 4500,
      });
    }
  }, [id, schedule]);

  const toggleSeat = useCallback((seat) => {
    if (seat.status === 'booked') return;
    setSelectedSeats(prev => prev.some(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat]);
  }, []);

  const handlePassengerChange = useCallback((field, value) => setPassenger(prev => ({ ...prev, [field]: value })), []);
  const handlePaymentChange = useCallback((field, value) => setPayment(prev => ({ ...prev, [field]: value })), []);

  const handleBuyTicket = () => {
    setShowPaymentForm(true);
  };

  const handlePayNow = () => {
    setBooking(true);
    setError('');
    setTimeout(() => {
      const ref = 'RR-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 90000 + 10000);
      setBookingRef(ref);
      setBooking(false);
      setActiveStep(3);
      setTimeout(() => setShowTicketModal(true), 100);
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowTicketModal(false);
  };

  const duration = schedule ? Math.abs(new Date(schedule.arrivalTime) - new Date(schedule.departureTime)) / 36e5 : 0;
  const totalPrice = (schedule?.price || 0) * selectedSeats.length;

  if (!schedule) return null;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f4f8', pb: 6 }}>
      <TicketModal open={showTicketModal} onClose={handleCloseModal} bookingDetails={{ schedule, passenger, selectedSeats, bookingRef, totalPrice, duration }} />

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f4c81, #1565c0)', py: 3, px: 3 }}>
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
          <Button onClick={() => navigate(-1)} sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, pl: 0 }}>← Back to Results</Button>
          <Typography color="rgba(255,255,255,0.75)" variant="caption" fontWeight={600}>{schedule?.bus?.name} · {schedule?.bus?.type}</Typography>
          <Typography variant="h5" color="white" fontWeight={800} mt={0.3}>{schedule?.route?.origin} → {schedule?.route?.destination}</Typography>
          <Typography color="rgba(255,255,255,0.7)" variant="body2">
            {new Date(schedule?.departureTime).toLocaleString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            {' · '}{Math.floor(duration)}h {Math.round((duration % 1) * 60)}m journey
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Box sx={{ background: 'white', borderBottom: '1px solid #e0e0e0', py: 2, px: 3 }}>
        <Box sx={{ maxWidth: 980, mx: 'auto' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>
        </Box>
      </Box>

      {/* Step Content */}
      <Box sx={{ maxWidth: 980, mx: 'auto', px: 3, mt: 3 }}>
        <motion.div key={activeStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>

          {/* STEP 0 — Seat Selection */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card sx={{ border: '1.5px solid #e0e9f5' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography fontWeight={700} fontSize={16} mb={2.5}><EventSeatIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />Bus Seat Layout</Typography>
                    <SeatMap seats={seats} selectedSeats={selectedSeats} onToggle={toggleSeat} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card><CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}><Typography fontWeight={600}>Price per seat</Typography><Typography fontWeight={700} color="primary">PKR {schedule?.price?.toLocaleString()}</Typography></Box>
                  <Box display="flex" justifyContent="space-between" mb={3}><Typography fontWeight={600}>Selected Seats</Typography><Typography fontWeight={700} color="primary">{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}</Typography></Box>
                  <Button fullWidth variant="contained" size="large" disabled={selectedSeats.length === 0} onClick={() => setActiveStep(1)}>Continue — {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} Selected</Button>
                </CardContent></Card>
              </Grid>
            </Grid>
          )}

          {/* STEP 1 — Passenger Details */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card><CardContent sx={{ p: 3 }}>
                  <Typography fontWeight={700} fontSize={16} mb={2.5}><PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />Passenger Details</Typography>
                  <PassengerForm passenger={passenger} onChange={handlePassengerChange} />
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card><CardContent sx={{ p: 2.5 }}>
                  <Typography fontWeight={600} color="text.secondary" gutterBottom>Selected Seats</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedSeats.map(seat => (
                      <Box key={seat.id} sx={{ bgcolor: '#1d4ed8', color: 'white', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: 12, fontWeight: 600 }}>{seat.seatNumber}</Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600} color="text.secondary">Total Fare</Typography>
                    <Typography fontWeight={700} color="primary" fontSize={18}>PKR {totalPrice.toLocaleString()}</Typography>
                  </Box>
                </CardContent></Card>
                <Box display="flex" gap={1} mt={2}>
                  <Button fullWidth variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                  <Button fullWidth variant="contained" size="large" disabled={!passenger.fullName || !passenger.phone} onClick={() => { setError(''); setActiveStep(2); setShowPaymentForm(false); }}>Continue to Payment</Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* STEP 2 — Payment with Buy Ticket button first */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography fontWeight={700} fontSize={16} mb={0.5}>
                      <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                      Payment Details
                    </Typography>
                    
                    {!showPaymentForm ? (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <CreditCardIcon sx={{ fontSize: 64, color: '#0f4c81', mb: 2, opacity: 0.7 }} />
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            Ready to complete your booking?
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            You're just one step away from confirming your seats
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleBuyTicket}
                            sx={{ 
                              py: 1.5, 
                              px: 4,
                              background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)',
                              fontSize: '1.1rem',
                              '&:hover': { background: 'linear-gradient(135deg, #0a3a62, #0f4c81)' }
                            }}
                          >
                            Buy Ticket
                          </Button>
                        </Box>
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                          <Typography variant="caption" color="text.secondary" mb={2.5} display="block">
                            Demo only — no real charges will be made
                          </Typography>
                          <PaymentForm payment={payment} onChange={handlePaymentChange} />
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                {/* Booking Summary - Only shown after Buy Ticket is clicked */}
                {showPaymentForm && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <BookingSummary
                      schedule={schedule}
                      selectedSeats={selectedSeats}
                      passenger={passenger}
                      totalPrice={totalPrice}
                    />
                  </motion.div>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
                
                <Box display="flex" gap={1}>
                  <Button fullWidth variant="outlined" onClick={() => { setActiveStep(1); setShowPaymentForm(false); }}>Back</Button>
                  {showPaymentForm && (
                    <Button fullWidth variant="contained" size="large"
                      disabled={booking || !payment.cardNumber || !payment.cardName || !payment.expiry || !payment.cvv}
                      onClick={handlePayNow}
                      startIcon={<LockIcon />}
                      sx={{ py: 1.5 }}>
                      {booking ? 'Processing...' : `Pay PKR ${totalPrice.toLocaleString()}`}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* STEP 3 — Payment Confirmation Ticket Page */}
          {activeStep === 3 && (
            <Box sx={{ maxWidth: 550, mx: 'auto' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                    <Box sx={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 30px rgba(74,222,128,0.4)' }}>
                      <CheckCircleIcon sx={{ fontSize: 54, color: '#ffffff' }} />
                    </Box>
                  </motion.div>

                  <Typography variant="h4" fontWeight={800} sx={{ color: '#0f4c81', mb: 1 }}>Payment Successful!</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Your ticket has been confirmed successfully</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ bgcolor: '#e3f2fd', py: 1, px: 2, borderRadius: 2, display: 'inline-block', mb: 3, fontFamily: 'monospace' }}>Ref: {bookingRef}</Typography>

                  <Grid container spacing={2} sx={{ mb: 3, textAlign: 'left' }}>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Amount Paid</Typography><Typography variant="h6" fontWeight={700} color="primary">PKR {totalPrice.toLocaleString()}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Payment Method</Typography><Typography variant="body2" fontWeight={600}>Credit/Debit Card</Typography></Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>📧 A confirmation email has been sent to {passenger.email}</Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button fullWidth variant="contained" size="large" onClick={() => setShowTicketModal(true)} sx={{ py: 1.2, background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)' }}>View E-Ticket</Button>
                    <Button fullWidth variant="outlined" size="large" onClick={() => navigate('/my-bookings')} sx={{ py: 1.2 }}>My Bookings</Button>
                    <Button fullWidth variant="text" onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>← Back to Home</Button>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          )}

        </motion.div>
      </Box>
    </Box>
  );
}
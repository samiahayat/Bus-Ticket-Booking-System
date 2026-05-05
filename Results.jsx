import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Typography,
  Grid, Chip, CircularProgress, Avatar, Divider,
  TextField, MenuItem
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import FilterListIcon from '@mui/icons-material/FilterList';
import { searchBuses } from '../data/mockBuses';

const BUS_TYPE_ICONS = {
  AC:      <AcUnitIcon fontSize="small" />,
  NonAC:   <AirlineSeatReclineNormalIcon fontSize="small" />,
  Sleeper: <NightShelterIcon fontSize="small" />,
};

const BUS_TYPE_COLORS = {
  AC:      { bg: '#e3f2fd', color: '#1565c0' },
  NonAC:   { bg: '#fff3e0', color: '#e65100' },
  Sleeper: { bg: '#f3e5f5', color: '#6a1b9a' },
};

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [sortBy,  setSortBy]        = useState('departure');
  const [filterType, setFilterType] = useState('All');

  const from = searchParams.get('from');
  const to   = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    if (!from || !to || !date) return;
    setLoading(true);

    const timer = setTimeout(() => {
      const buses = searchBuses(from, to, date);
      setResults(buses);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);

    // ── When your backend is ready, remove the mock code above and
    //    uncomment this block instead: ──────────────────────────────
    // import axios from 'axios';
    // axios.get('/api/schedules/search', { params: { from, to, date } })
    //   .then(r => setResults(r.data))
    //   .catch(console.error)
    //   .finally(() => setLoading(false));
  }, [from, to, date]);

  const displayed = results
    .filter(s => filterType === 'All' || s.bus.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price')     return a.price - b.price;
      if (sortBy === 'departure') return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortBy === 'duration') {
        const durA = new Date(a.arrivalTime) - new Date(a.departureTime);
        const durB = new Date(b.arrivalTime) - new Date(b.departureTime);
        return durA - durB;
      }
      return 0;
    });

  const fmtTime = iso =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getDuration = (dep, arr) => {
    const ms = new Date(arr) - new Date(dep);
    const h  = Math.floor(ms / 36e5);
    const m  = Math.round((ms % 36e5) / 60000);
    return `${h}h ${m}m`;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f0f4f8' }}>

      {/* ── Header ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1565c0 100%)',
        py: 3, px: 3
      }}>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography color="rgba(255,255,255,0.8)" variant="caption" fontWeight={600}>
            AVAILABLE BUSES
          </Typography>
          <Typography variant="h5" color="white" fontWeight={800} mt={0.5}>
            {from} → {to}
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" variant="body2">
            {date && new Date(date + 'T00:00:00').toLocaleDateString('en-PK', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
            {' · '}{displayed.length} bus{displayed.length !== 1 ? 'es' : ''} found
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 3 }}>

        {/* ── Filter / Sort bar ── */}
        {!loading && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ mb: 3, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <FilterListIcon color="primary" sx={{ verticalAlign: 'middle' }} />
                  <Typography component="span" fontWeight={600} ml={0.5}>
                    Filter & Sort
                  </Typography>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <TextField
                    select size="small" label="Bus Type" value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    sx={{ minWidth: 130 }}
                  >
                    {['All', 'AC', 'NonAC', 'Sleeper'].map(t => (
                      <MenuItem key={t} value={t}>
                        {t === 'NonAC' ? 'Non-AC' : t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <TextField
                    select size="small" label="Sort By" value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="departure">Departure Time</MenuItem>
                    <MenuItem value="price">Price (Low → High)</MenuItem>
                    <MenuItem value="duration">Duration</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress size={48} />
            <Typography mt={2} color="text.secondary">
              Finding best buses for you...
            </Typography>
          </Box>
        )}

        {/* ── Empty state ── */}
        {!loading && displayed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <DirectionsBusIcon sx={{ fontSize: 72, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>
                No buses found
              </Typography>
              <Typography color="text.secondary" mb={3}>
                No buses available for {from} → {to} on this date.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')}>
                Search Again
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ── Bus Cards ── */}
        <AnimatePresence>
          {displayed.map((schedule, index) => {
            const busType   = schedule.bus?.type || 'AC';
            const typeStyle = BUS_TYPE_COLORS[busType] || BUS_TYPE_COLORS.AC;
            const seatsLeft = schedule.availableSeats;

            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Card sx={{
                  mb: 2.5,
                  border: '1.5px solid #e0e9f5',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(15,76,129,0.15)',
                    transform: 'translateY(-2px)',
                    borderColor: '#1565c0',
                  },
                  transition: 'all 0.25s ease',
                }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Grid container alignItems="center" spacing={2}>

                      {/* ── Bus Info ── */}
                      <Grid item xs={12} sm={3}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{
                            background: 'linear-gradient(135deg, #0f4c81, #1a6bb5)',
                            width: 52, height: 52, fontSize: 24,
                          }}>
                            {schedule.bus?.logo}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} fontSize={14} lineHeight={1.2}>
                              {schedule.bus?.name}
                            </Typography>
                            <Chip
                              icon={BUS_TYPE_ICONS[busType]}
                              label={busType === 'NonAC' ? 'Non-AC' : busType}
                              size="small"
                              sx={{
                                mt: 0.5,
                                background: typeStyle.bg,
                                color: typeStyle.color,
                                fontWeight: 600, fontSize: 11,
                              }}
                            />
                            <Box display="flex" alignItems="center" gap={0.3} mt={0.5}>
                              <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                              <Typography variant="caption" fontWeight={600} color="text.secondary">
                                {schedule.bus?.rating}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* ── Times ── */}
                      <Grid item xs={12} sm={5.5}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">

                          {/* Departure */}
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight={800} color="#0f4c81" lineHeight={1}>
                              {fmtTime(schedule.departureTime)}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="text.secondary" mt={0.3}>
                              {from}
                            </Typography>
                          </Box>

                          {/* Duration line */}
                          <Box flex={1} mx={2} textAlign="center">
                            <Typography variant="caption" color="text.secondary"
                              display="flex" alignItems="center" justifyContent="center"
                              gap={0.4} mb={0.5}>
                              <AccessTimeIcon sx={{ fontSize: 13 }} />
                              {getDuration(schedule.departureTime, schedule.arrivalTime)}
                            </Typography>
                            <Box sx={{ position: 'relative', height: 2 }}>
                              <Box sx={{
                                height: 2,
                                background: 'linear-gradient(90deg, #0f4c81, #f97316)',
                                borderRadius: 1,
                              }} />
                              <Box sx={{
                                position: 'absolute', right: -1, top: -4,
                                width: 10, height: 10, borderRadius: '50%',
                                background: '#f97316', border: '2px solid white',
                                boxShadow: '0 0 0 1px #f97316',
                              }} />
                            </Box>
                          </Box>

                          {/* Arrival */}
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight={800} color="#f97316" lineHeight={1}>
                              {fmtTime(schedule.arrivalTime)}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="text.secondary" mt={0.3}>
                              {to}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Amenities */}
                        <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
                          {busType === 'AC' && (
                            <Chip label="❄️ AC" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                          )}
                          {busType === 'Sleeper' && (
                            <Chip label="🛏️ Sleeper" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                          )}
                          <Chip label="🎒 Luggage" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                          <Chip label="🔌 USB Charging" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        </Box>
                      </Grid>

                      {/* ── Price & Book ── */}
                      <Grid item xs={12} sm={3.5}>
                        <Box sx={{
                          borderLeft: { sm: '1.5px solid #e0e0e0' },
                          pl: { sm: 2 },
                          textAlign: { xs: 'left', sm: 'center' },
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Starting from
                          </Typography>
                          <Typography variant="h5" color="primary" fontWeight={800} lineHeight={1.2}>
                            PKR {schedule.price?.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per seat
                          </Typography>

                          <Box display="flex" alignItems="center"
                            justifyContent={{ xs: 'flex-start', sm: 'center' }}
                            gap={0.5} mt={0.5} mb={1.5}>
                            <EventSeatIcon sx={{
                              fontSize: 14,
                              color: seatsLeft <= 5 ? 'warning.main' : 'success.main',
                            }} />
                            <Typography
                              variant="caption" fontWeight={600}
                              color={seatsLeft <= 5 ? 'warning.main' : 'success.main'}
                            >
                              {seatsLeft <= 5
                                ? `Only ${seatsLeft} seats left!`
                                : `${seatsLeft} seats available`}
                            </Typography>
                          </Box>

                          <Button
                            variant="contained" fullWidth size="large"
                            onClick={() => navigate(`/schedule/${schedule.id}`, {
                              state: { schedule }
                            })}
                            sx={{ py: 1.2, fontWeight: 700 }}
                          >
                            Book Now
                          </Button>
                        </Box>
                      </Grid>

                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
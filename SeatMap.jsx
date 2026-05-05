import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Box, Grid, Tooltip, Typography } from '@mui/material';

const SEAT_COLORS = {
  available: '#4caf50',
  booked: '#f44336',
  selected: '#2196f3'
};

export default function SeatMap({ scheduleId, totalSeats, onSelectionChange }) {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Load seat availability
    fetch(`/api/schedules/${scheduleId}/seats`)
      .then(r => r.json())
      .then(setSeats);

    // Connect SignalR for live updates
    const token = localStorage.getItem('token');
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`/hubs/seats?access_token=${token}`)
      .withAutomaticReconnect()
      .build();

    conn.on('SeatsUpdated', (seatIds, status) => {
      setSeats(prev => prev.map(s =>
        seatIds.includes(s.id) ? { ...s, status } : s
      ));
    });

    conn.start()
      .then(() => conn.invoke('JoinScheduleGroup', scheduleId));

    return () => { conn.stop(); };
  }, [scheduleId]);

  const toggleSeat = (seat) => {
    if (seat.status === 'booked') return;
    const newSelected = selected.includes(seat.id)
      ? selected.filter(id => id !== seat.id)
      : [...selected, seat.id];
    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  const getColor = (seat) => {
    if (selected.includes(seat.id)) return SEAT_COLORS.selected;
    if (seat.status === 'booked') return SEAT_COLORS.booked;
    return SEAT_COLORS.available;
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Select Seats</Typography>
      {/* Legend */}
      <Box display="flex" gap={2} mb={2}>
        {Object.entries(SEAT_COLORS).map(([label, color]) => (
          <Box key={label} display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 16, height: 16, bgcolor: color, borderRadius: 1 }} />
            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      {/* Bus front indicator */}
      <Box sx={{ textAlign: 'center', mb: 1, color: 'text.secondary', fontSize: 13 }}>
        ← Front of bus
      </Box>
      <Grid container spacing={1} maxWidth={300}>
        {seats.map(seat => (
          <Grid item xs={3} key={seat.id}>
            <Tooltip title={`Seat ${seat.seatNumber}`}>
              <Box
                onClick={() => toggleSeat(seat)}
                sx={{
                  width: 40, height: 40,
                  bgcolor: getColor(seat),
                  borderRadius: 1,
                  cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': { opacity: 0.85 }
                }}
              >
                {seat.seatNumber}
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Typography mt={2} variant="body2">
        Selected: {selected.length} seat(s)
      </Typography>
    </Box>
  );
}
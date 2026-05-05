import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error);
  }, []);

  const cards = [
    { label: 'Total Buses',    value: stats?.totalBuses,    icon: <DirectionsBusIcon fontSize="large" />,      color: '#1976d2' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: <ConfirmationNumberIcon fontSize="large" />, color: '#388e3c' },
    { label: 'Total Users',    value: stats?.totalUsers,    icon: <PeopleIcon fontSize="large" />,             color: '#f57c00' },
    { label: 'Revenue (PKR)',  value: stats?.totalRevenue?.toLocaleString(), icon: <AttachMoneyIcon fontSize="large" />, color: '#7b1fa2' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card elevation={2}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {card.value ?? '—'}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {card.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
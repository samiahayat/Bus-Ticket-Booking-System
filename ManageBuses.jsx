import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent,
  Typography, TextField, Grid
} from '@mui/material';

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ name: '', busNumber: '', type: 'AC', totalSeats: 40 });

  useEffect(() => {
    axios.get('/api/buses').then(r => setBuses(r.data));
  }, []);

  const handleAdd = async () => {
    try {
      const { data } = await axios.post('/api/buses', form);
      setBuses(prev => [...prev, data]);
      setForm({ name: '', busNumber: '', type: 'AC', totalSeats: 40 });
    } catch {
      alert('Failed to add bus.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    await axios.delete(`/api/buses/${id}`);
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  return (
    <Box maxWidth={900} mx="auto" p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>Manage Buses</Typography>

      <Card elevation={2} sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>Add New Bus</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Bus Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Bus Number" value={form.busNumber}
              onChange={e => setForm({ ...form, busNumber: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Total Seats" type="number" value={form.totalSeats}
              onChange={e => setForm({ ...form, totalSeats: parseInt(e.target.value) })} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button fullWidth variant="contained" size="large" onClick={handleAdd}>
              Add Bus
            </Button>
          </Grid>
        </Grid>
      </Card>

      {buses.map(bus => (
        <Card key={bus.id} elevation={1} sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight={600}>{bus.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {bus.busNumber} • {bus.type} • {bus.totalSeats} seats
              </Typography>
            </Box>
            <Button color="error" variant="outlined" onClick={() => handleDelete(bus.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
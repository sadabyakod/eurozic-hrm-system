
import React, { useEffect, useState } from 'react';
import { getOfferLetters, addOfferLetter, updateOfferLetter, deleteOfferLetter } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const OfferLetter = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({ candidateName: '', candidateEmail: '', position: '', releaseDate: '', status: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchOffers = async () => {
    const res = await getOfferLetters();
    setOffers(res.data);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateOfferLetter(editingId, form);
      setEditingId(null);
    } else {
      await addOfferLetter(form);
    }
    setForm({ candidateName: '', candidateEmail: '', position: '', releaseDate: '', status: '' });
    fetchOffers();
  };

  const handleEdit = offer => {
    setForm({
      candidateName: offer.candidateName,
      candidateEmail: offer.candidateEmail || '',
      position: offer.position,
      releaseDate: offer.releaseDate ? offer.releaseDate.slice(0, 10) : '',
      status: offer.status,
    });
    setEditingId(offer._id);
  };

  const handleDelete = async id => {
    await deleteOfferLetter(id);
    fetchOffers();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Offer Letter Release</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Candidate Name" name="candidateName" value={form.candidateName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Candidate Email" name="candidateEmail" value={form.candidateEmail} onChange={handleChange} fullWidth required type="email" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Position" name="position" value={form.position} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Release Date" name="releaseDate" value={form.releaseDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4} alignSelf="center">
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editingId ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <List>
          {offers.map(offer => (
            <ListItem key={offer._id} divider>
              <ListItemText
                primary={`Name: ${offer.candidateName} | Position: ${offer.position} | Status: ${offer.status}`}
                secondary={`Release: ${offer.releaseDate?.slice(0,10)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(offer)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(offer._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default OfferLetter;

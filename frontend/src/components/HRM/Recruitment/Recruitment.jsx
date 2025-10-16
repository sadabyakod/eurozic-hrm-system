
import React, { useEffect, useState } from 'react';
import { getRecruitments, addRecruitment, updateRecruitment, deleteRecruitment } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Recruitment = () => {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ candidateName: '', position: '', status: '', appliedDate: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCandidates = async () => {
    const res = await getRecruitments();
    setCandidates(res.data);
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateRecruitment(editingId, form);
      setEditingId(null);
    } else {
      await addRecruitment(form);
    }
    setForm({ candidateName: '', position: '', status: '', appliedDate: '' });
    fetchCandidates();
  };

  const handleEdit = candidate => {
    setForm({
      candidateName: candidate.candidateName,
      position: candidate.position,
      status: candidate.status,
      appliedDate: candidate.appliedDate ? candidate.appliedDate.slice(0, 10) : '',
    });
    setEditingId(candidate._id);
  };

  const handleDelete = async id => {
    await deleteRecruitment(id);
    fetchCandidates();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Recruitment</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Candidate Name" name="candidateName" value={form.candidateName} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Position" name="position" value={form.position} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Applied Date" name="appliedDate" value={form.appliedDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
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
          {candidates.map(candidate => (
            <ListItem key={candidate._id} divider>
              <ListItemText
                primary={`Name: ${candidate.candidateName} | Position: ${candidate.position} | Status: ${candidate.status}`}
                secondary={`Applied: ${candidate.appliedDate?.slice(0,10)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(candidate)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(candidate._id)}>
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

export default Recruitment;



import React, { useEffect, useState } from 'react';
import { getLeaves, addLeave, updateLeave, deleteLeave } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const LeaveTracking = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ employeeId: '', startDate: '', endDate: '', type: '', status: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchLeaves = async () => {
    const res = await getLeaves();
    setLeaves(res.data);
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateLeave(editingId, form);
      setEditingId(null);
    } else {
      await addLeave(form);
    }
    setForm({ employeeId: '', startDate: '', endDate: '', type: '', status: '' });
    fetchLeaves();
  };

  const handleEdit = leave => {
    setForm({
      employeeId: leave.employeeId,
      startDate: leave.startDate ? leave.startDate.slice(0, 10) : '',
      endDate: leave.endDate ? leave.endDate.slice(0, 10) : '',
      type: leave.type,
      status: leave.status,
    });
    setEditingId(leave._id);
  };

  const handleDelete = async id => {
    await deleteLeave(id);
    fetchLeaves();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Leave Tracking</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="End Date" name="endDate" value={form.endDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth required />
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
          {leaves.map(leave => (
            <ListItem key={leave._id} divider>
              <ListItemText
                primary={`Employee: ${leave.employeeId} | ${leave.type} | ${leave.status}`}
                secondary={`From: ${leave.startDate?.slice(0,10)} To: ${leave.endDate?.slice(0,10)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(leave)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(leave._id)}>
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
export default LeaveTracking;

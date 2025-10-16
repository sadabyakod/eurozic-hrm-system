
import React, { useEffect, useState } from 'react';
import { getReviews, addReview, updateReview, deleteReview } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PerformanceReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ employeeId: '', reviewer: '', reviewDate: '', comments: '', rating: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    const res = await getReviews();
    setReviews(res.data);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateReview(editingId, form);
      setEditingId(null);
    } else {
      await addReview(form);
    }
    setForm({ employeeId: '', reviewer: '', reviewDate: '', comments: '', rating: '' });
    fetchReviews();
  };

  const handleEdit = review => {
    setForm({
      employeeId: review.employeeId,
      reviewer: review.reviewer,
      reviewDate: review.reviewDate ? review.reviewDate.slice(0, 10) : '',
      comments: review.comments,
      rating: review.rating,
    });
    setEditingId(review._id);
  };

  const handleDelete = async id => {
    await deleteReview(id);
    fetchReviews();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Performance Reviews</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Reviewer" name="reviewer" value={form.reviewer} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Review Date" name="reviewDate" value={form.reviewDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Comments" name="comments" value={form.comments} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Rating" name="rating" value={form.rating} onChange={handleChange} type="number" fullWidth required inputProps={{ min: 1, max: 5 }} />
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
          {reviews.map(review => (
            <ListItem key={review._id} divider>
              <ListItemText
                primary={`Employee: ${review.employeeId} | Reviewer: ${review.reviewer} | Rating: ${review.rating}`}
                secondary={`Date: ${review.reviewDate?.slice(0,10)} | Comments: ${review.comments}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(review)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(review._id)}>
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

export default PerformanceReviews;

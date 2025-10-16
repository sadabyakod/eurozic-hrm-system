
import React, { useEffect, useState } from 'react';
import { getPayrolls, addPayroll, updatePayroll, deletePayroll } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [form, setForm] = useState({ employeeId: '', salary: '', payDate: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchPayrolls = async () => {
    const res = await getPayrolls();
    setPayrolls(res.data);
  };

  useEffect(() => { fetchPayrolls(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updatePayroll(editingId, form);
      setEditingId(null);
    } else {
      await addPayroll(form);
    }
    setForm({ employeeId: '', salary: '', payDate: '' });
    fetchPayrolls();
  };

  const handleEdit = payroll => {
    setForm({
      employeeId: payroll.employeeId,
      salary: payroll.salary,
      payDate: payroll.payDate ? payroll.payDate.slice(0, 10) : '',
    });
    setEditingId(payroll._id);
  };

  const handleDelete = async id => {
    await deletePayroll(id);
    fetchPayrolls();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Payroll</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Salary" name="salary" value={form.salary} onChange={handleChange} type="number" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Pay Date" name="payDate" value={form.payDate} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
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
          {payrolls.map(payroll => (
            <ListItem key={payroll._id} divider>
              <ListItemText
                primary={`Employee: ${payroll.employeeId} | Salary: ${payroll.salary}`}
                secondary={`Pay Date: ${payroll.payDate?.slice(0,10)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(payroll)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(payroll._id)}>
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

export default Payroll;

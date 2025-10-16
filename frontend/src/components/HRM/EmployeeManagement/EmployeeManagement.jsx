import React from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../api';
import { Typography, TextField, Button, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const EmployeeManagement = () => {
  const [employees, setEmployees] = React.useState([]);
  const [form, setForm] = React.useState({ name: '', email: '', position: '', department: '', dateOfJoining: '' });
  const [editingId, setEditingId] = React.useState(null);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };

  React.useEffect(() => { fetchEmployees(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateEmployee(editingId, form);
      setEditingId(null);
    } else {
      await addEmployee(form);
    }
    setForm({ name: '', email: '', position: '', department: '', dateOfJoining: '' });
    fetchEmployees();
  };

  const handleEdit = emp => {
    setForm({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      department: emp.department,
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.slice(0, 10) : '',
    });
    setEditingId(emp._id);
  };

  const handleDelete = async id => {
    await deleteEmployee(id);
    fetchEmployees();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Employee Management</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Position" name="position" value={form.position} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Department" name="department" value={form.department} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Date of Joining" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} type="date" fullWidth required InputLabelProps={{ shrink: true }} />
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
          {employees.map(emp => (
            <ListItem key={emp._id} divider>
              <ListItemText
                primary={`${emp.name} (${emp.position})`}
                secondary={`${emp.department} | ${emp.email} | Joined: ${emp.dateOfJoining?.slice(0,10)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(emp)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(emp._id)}>
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

export default EmployeeManagement;

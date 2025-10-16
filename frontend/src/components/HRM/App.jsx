
import React, { useState, useEffect } from 'react';
import { EmployeeManagement, LeaveTracking, Payroll, Recruitment, PerformanceReviews, OfferLetter } from './index';
import Login from './Login';
import logo from '../../assets/company-logo.jpeg';
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Box, Paper, Avatar, Button } from '@mui/material';

const TABS = [
  { label: 'Employee Management', component: <EmployeeManagement /> },
  { label: 'Leave Tracking', component: <LeaveTracking /> },
  { label: 'Payroll', component: <Payroll /> },
  { label: 'Recruitment', component: <Recruitment /> },
  { label: 'Performance Reviews', component: <PerformanceReviews /> },
  { label: 'Offer Letter', component: <OfferLetter /> },
];


const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to load user from token
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally decode token for user info, or just mark as logged in
      setUser({});
    }
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Avatar src={logo} alt="Company Logo" sx={{ width: 56, height: 56, mr: 2 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            HR Tool Suite
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="HRM Tabs"
            sx={{ mb: 2 }}
          >
            {TABS.map((tab, idx) => (
              <Tab key={tab.label} label={tab.label} />
            ))}
          </Tabs>
          <Box sx={{ minHeight: 400, p: 1 }}>
            {TABS[activeTab].component}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;

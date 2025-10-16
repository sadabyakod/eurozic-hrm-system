import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Departments from './pages/Departments';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <aside className="sidebar">
          <h1>Neurozic HRM</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/employees">Employees</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
              <li>
                <Link to="/attendance">Attendance</Link>
              </li>
              <li>
                <Link to="/leave">Leave Management</Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer',
                    display: 'block',
                    padding: '10px',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '5px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

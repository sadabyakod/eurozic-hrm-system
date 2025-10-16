import React from 'react';
import { employees, departments, attendanceRecords, leaveRequests } from '../data/mockData';

function Dashboard() {
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const presentToday = attendanceRecords.filter(a => a.status === 'Present').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  const recentEmployees = employees.slice(0, 3);

  return (
    <div>
      <div className="header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to Neurozic HRM Dashboard</p>
      </div>

      <div className="dashboard-cards">
        <div className="card primary">
          <h3>Total Employees</h3>
          <div className="value">{totalEmployees}</div>
        </div>
        <div className="card success">
          <h3>Departments</h3>
          <div className="value">{totalDepartments}</div>
        </div>
        <div className="card warning">
          <h3>Present Today</h3>
          <div className="value">{presentToday}</div>
        </div>
        <div className="card info">
          <h3>Pending Leaves</h3>
          <div className="value">{pendingLeaves}</div>
        </div>
      </div>

      <div className="data-table">
        <h3>Recent Employees</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <span className="badge badge-success">{employee.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

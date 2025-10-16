import React from 'react';
import { attendanceRecords } from '../data/mockData';

function Attendance() {
  return (
    <div>
      <div className="header">
        <h2>Attendance Tracking</h2>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="dashboard-cards" style={{ marginBottom: '20px' }}>
        <div className="card primary">
          <h3>Total Present</h3>
          <div className="value">
            {attendanceRecords.filter(a => a.status === 'Present').length}
          </div>
        </div>
        <div className="card danger">
          <h3>Total Absent</h3>
          <div className="value">
            {attendanceRecords.filter(a => a.status === 'Absent').length}
          </div>
        </div>
      </div>

      <div className="data-table">
        <h3>Today's Attendance</h3>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map(record => (
              <tr key={record.id}>
                <td>{record.employeeName}</td>
                <td>{record.date}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>
                  <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;

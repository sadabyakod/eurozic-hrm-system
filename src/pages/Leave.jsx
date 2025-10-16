import React, { useState } from 'react';
import { leaveRequests as initialLeaveRequests } from '../data/mockData';

function Leave() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const handleApprove = (id) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: 'Approved' } : leave
    ));
  };

  const handleReject = (id) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: 'Rejected' } : leave
    ));
  };

  return (
    <div>
      <div className="header">
        <h2>Leave Management</h2>
      </div>

      <div className="dashboard-cards" style={{ marginBottom: '20px' }}>
        <div className="card warning">
          <h3>Pending Requests</h3>
          <div className="value">
            {leaveRequests.filter(l => l.status === 'Pending').length}
          </div>
        </div>
        <div className="card success">
          <h3>Approved Leaves</h3>
          <div className="value">
            {leaveRequests.filter(l => l.status === 'Approved').length}
          </div>
        </div>
      </div>

      <div className="data-table">
        <h3>Leave Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(leave => (
              <tr key={leave.id}>
                <td>{leave.employeeName}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`badge ${
                    leave.status === 'Approved' ? 'badge-success' : 
                    leave.status === 'Rejected' ? 'badge-danger' : 
                    'badge-warning'
                  }`}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  {leave.status === 'Pending' && (
                    <>
                      <button 
                        className="btn btn-success btn-sm" 
                        onClick={() => handleApprove(leave.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleReject(leave.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leave;

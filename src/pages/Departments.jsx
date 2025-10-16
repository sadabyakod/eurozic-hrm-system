import React from 'react';
import { departments } from '../data/mockData';

function Departments() {
  return (
    <div>
      <div className="header">
        <h2>Department Management</h2>
      </div>

      <div className="data-table">
        <h3>Department List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Department Head</th>
              <th>Employee Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(dept => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{dept.head}</td>
                <td>{dept.employeeCount}</td>
                <td>
                  <button className="btn btn-primary btn-sm">View</button>
                  <button className="btn btn-success btn-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Departments;

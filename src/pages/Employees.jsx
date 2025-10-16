import React, { useState } from 'react';
import { employees as initialEmployees } from '../data/mockData';

function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: '',
    salary: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const maxId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) : 0;
    const newEmployee = {
      id: maxId + 1,
      ...formData,
      status: 'Active',
    };
    setEmployees([...employees, newEmployee]);
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: '',
      salary: '',
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div>
      <div className="header">
        <h2>Employee Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showForm && (
        <div className="data-table" style={{ marginBottom: '20px' }}>
          <h3>Add New Employee</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Employee</button>
              <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table">
        <h3>Employee List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Join Date</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.joinDate}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td>
                  <span className="badge badge-success">{employee.status}</span>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;

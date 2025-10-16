# Neurozic HRM System

Neurozic Software Solutions Pvt Ltd Human Resource Management Dashboard

## Overview

A comprehensive Human Resource Management (HRM) Dashboard system built with React and Vite. This application provides a complete solution for managing employees, departments, attendance, and leave requests.

## Features

### 1. Dashboard
- Overview of key HR metrics
- Total employees count
- Department statistics
- Today's attendance summary
- Pending leave requests

### 2. Employee Management
- View all employees
- Add new employees
- Delete employees
- Track employee information (name, email, department, position, salary, join date)

### 3. Department Management
- View all departments
- Department head information
- Employee count per department

### 4. Attendance Tracking
- Daily attendance records
- Check-in and check-out times
- Present/Absent status tracking
- Attendance statistics

### 5. Leave Management
- View leave requests
- Approve/Reject leave requests
- Track leave types (Vacation, Sick Leave, Personal)
- Leave status monitoring

### 6. Authentication
- Login system
- Secure access to dashboard

## Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.10
- **Routing**: React Router DOM 7.9.4
- **Styling**: CSS3 with modern gradients and responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sadabyakod/eurozic-hrm-system.git
cd eurozic-hrm-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Login
- Access the application through the login page
- Enter any email and password to access the dashboard (demo mode)

### Navigation
- Use the sidebar to navigate between different modules:
  - Dashboard
  - Employees
  - Departments
  - Attendance
  - Leave Management

### Managing Employees
1. Click on "Employees" in the sidebar
2. Click "Add Employee" to add a new employee
3. Fill in the employee details
4. Click "Add Employee" to save

### Viewing Attendance
1. Click on "Attendance" in the sidebar
2. View today's attendance records
3. See who is present or absent

### Managing Leave Requests
1. Click on "Leave Management" in the sidebar
2. View all leave requests
3. Approve or reject pending requests

## Project Structure

```
eurozic-hrm-system/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   ├── data/
│   │   └── mockData.js    # Mock data for demonstration
│   ├── pages/
│   │   ├── Dashboard.jsx  # Dashboard page
│   │   ├── Employees.jsx  # Employee management
│   │   ├── Departments.jsx # Department management
│   │   ├── Attendance.jsx # Attendance tracking
│   │   ├── Leave.jsx      # Leave management
│   │   └── Login.jsx      # Login page
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Project dependencies
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features in Detail

### Dashboard Metrics
- Real-time employee count
- Department statistics
- Daily attendance overview
- Pending leave requests count

### Employee Management
- Complete CRUD operations
- Employee information tracking
- Department assignment
- Salary management
- Status tracking

### Modern UI/UX
- Responsive design
- Gradient cards for statistics
- Interactive tables
- Smooth transitions
- Professional color scheme

## Future Enhancements

- Backend API integration
- Real authentication system
- Employee performance tracking
- Payroll management
- Reports and analytics
- Email notifications
- Advanced search and filters
- Role-based access control

## License

ISC

## Contact

For more information about Neurozic Software Solutions Pvt Ltd, please contact us through our official channels.

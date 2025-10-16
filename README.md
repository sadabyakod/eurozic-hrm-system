# Neurozic HRM System

A comprehensive Human Resource Management (HRM) system built with React.js frontend and Node.js backend API.

## 🚀 Features

- **Employee Management**: Complete CRUD operations for employee records
- **Leave Tracking**: Manage employee leave requests and approvals
- **Payroll Management**: Handle salary calculations and payroll processing
- **Recruitment**: Manage job postings and candidate applications
- **Performance Reviews**: Conduct and track employee performance evaluations
- **Offer Letter Generation**: Create and manage employment offers
- **User Authentication**: Secure JWT-based authentication system
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🛠️ Technology Stack

### Frontend
- **React.js 18.2.0** - Modern UI framework
- **Material-UI** - Professional component library
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (with demo mode fallback)
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Swagger** - API documentation

## 📁 Project Structure

```
AIChatBot/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── HRM/         # HRM-specific components
│   │   │   └── ChatBot.jsx  # Original chatbot component
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   ├── server-demo.js       # Demo server (no MongoDB)
│   ├── swagger.js           # API documentation config
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - demo mode available)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   # With MongoDB
   node server.js
   
   # Demo mode (without MongoDB)
   node server-demo.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Leave Management
- `GET /api/leave` - Get all leave requests
- `POST /api/leave` - Create leave request
- `PUT /api/leave/:id` - Update leave request
- `DELETE /api/leave/:id` - Delete leave request

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Create payroll entry
- `PUT /api/payroll/:id` - Update payroll
- `DELETE /api/payroll/:id` - Delete payroll

### Recruitment
- `GET /api/recruitment` - Get job postings
- `POST /api/recruitment` - Create job posting
- `PUT /api/recruitment/:id` - Update job posting
- `DELETE /api/recruitment/:id` - Delete job posting

### Performance Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Offer Letters
- `GET /api/offerletter` - Get offer letters
- `POST /api/offerletter` - Create offer letter
- `PUT /api/offerletter/:id` - Update offer letter
- `DELETE /api/offerletter/:id` - Delete offer letter

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neurozic_hrm
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## 🚀 Deployment

The application is ready for deployment to various platforms:

- **Frontend**: Can be deployed to Netlify, Vercel, or Azure Static Web Apps
- **Backend**: Can be deployed to Heroku, Azure App Service, or AWS EC2
- **Database**: MongoDB Atlas for cloud database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Neurozic Software Solutions** - Professional HRM System Development

## 📞 Support

For support and inquiries, please contact the development team.

---

Built with ❤️ by Neurozic Software Solutions

This is a Human Resource Management system built with React.
It includes:
- frontend/: React app with HRM management components including Employee Management, Leave Tracking, Payroll, Performance Reviews, Recruitment, and Offer Letters

## Defaults chosen for you
- Frontend: React development server (npm start)

## How to run (local)

### Frontend (React)
1. Node.js and npm required (recommend Node 18+).
2. Open terminal in `frontend` folder.
3. Run:
   ```
   npm install
   npm start
   ```
4. The app will open at http://localhost:3000

## Deployment
- Frontend: Vercel / Netlify / static hosting

## Notes
- This is a frontend-only HRM system with mock data for all components.
- For production, add authentication, data persistence, and backend services.
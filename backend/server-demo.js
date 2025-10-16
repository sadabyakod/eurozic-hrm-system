const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Neurozic HRM API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Neurozic HRM API is running successfully',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Not connected (MongoDB required for full functionality)'
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Neurozic Software Solutions HRM API',
    version: '1.0.0',
    documentation: '/api-docs',
    status: 'Demo Mode - MongoDB not connected',
    endpoints: {
      health: '/api/health',
      documentation: '/api-docs'
    }
  });
});

// Sample auth route for demo
app.post('/api/auth/login', (req, res) => {
  res.json({
    status: 'success',
    message: 'Demo login - MongoDB required for full functionality',
    data: {
      user: {
        name: 'Demo User',
        email: 'demo@neurozic.com',
        role: 'Admin'
      },
      token: 'demo-jwt-token'
    }
  });
});

// Sample employees route for demo
app.get('/api/employees', (req, res) => {
  res.json({
    status: 'success',
    message: 'Demo data - MongoDB required for full functionality',
    data: [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@neurozic.com',
        employeeId: 'EMP001',
        department: 'Engineering',
        position: 'Software Developer',
        salary: 75000,
        status: 'Active'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@neurozic.com',
        employeeId: 'EMP002',
        department: 'HR',
        position: 'HR Manager',
        salary: 80000,
        status: 'Active'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      pages: 1
    }
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Neurozic HRM API Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:3000`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`💡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚠️  Demo Mode: Install MongoDB for full functionality`);
});
# 📚 API Documentation with Swagger

## 🎉 Swagger API Documentation Added Successfully!

Your Neurozic HRM API now includes comprehensive Swagger/OpenAPI documentation that provides:

### 🌟 Features Available

- **Interactive API Testing** - Test endpoints directly from the browser
- **Comprehensive Documentation** - Detailed descriptions of all endpoints
- **Request/Response Examples** - See exactly what data to send and expect
- **Authentication Support** - Built-in JWT token authentication
- **Schema Validation** - View data models and validation rules

### 🔗 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **API Documentation** | http://localhost:5000/api-docs | Interactive Swagger UI |
| **API Base URL** | http://localhost:5000 | Main API endpoint |
| **Health Check** | http://localhost:5000/api/health | Server status |

### 🚀 How to Use Swagger Documentation

1. **Open Swagger UI**: Navigate to http://localhost:5000/api-docs
2. **Explore Endpoints**: Browse all available API endpoints organized by categories
3. **Authenticate**: Click "Authorize" and enter your JWT token (Bearer token)
4. **Test APIs**: Click "Try it out" on any endpoint to test it directly
5. **View Schemas**: Check the "Schemas" section for data models

### 🔐 Authentication

Most endpoints require authentication. To use them:

1. First, register or login via `/api/auth/register` or `/api/auth/login`
2. Copy the JWT token from the response
3. In Swagger UI, click the "Authorize" button
4. Enter: `Bearer YOUR_JWT_TOKEN`
5. Now you can access protected endpoints

### 📋 Available API Categories

- **🔐 Authentication** - User registration, login, profile management
- **👥 Employees** - Employee CRUD operations and management
- **🏖️ Leave Management** - Leave requests, approvals, tracking
- **💰 Payroll** - Salary processing and payroll management
- **📋 Recruitment** - Hiring pipeline and candidate management
- **⭐ Performance Reviews** - Employee evaluations and feedback
- **📄 Offer Letters** - Job offer creation and management

### 🛠️ Development Notes

- All endpoints return standardized JSON responses
- Pagination is supported on list endpoints (page, limit parameters)
- Search and filtering available on most GET endpoints
- Comprehensive error handling with detailed messages
- Input validation with clear error descriptions

### 📊 Sample API Usage

```javascript
// Register a new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@neurozic.com",
  "password": "password123",
  "role": "Employee",
  "department": "Engineering"
}

// Create an employee
POST /api/employees
{
  "name": "Jane Smith",
  "email": "jane@neurozic.com",
  "employeeId": "EMP001",
  "department": "Engineering",
  "position": "Software Developer",
  "salary": 75000
}
```

### 🔄 Auto-Generated Documentation

The Swagger documentation is automatically generated from JSDoc comments in the route files. As you add more endpoints or modify existing ones, the documentation will be automatically updated.

---

**Happy API Testing! 🎊**

For any questions or issues, please check the API responses or contact the development team.
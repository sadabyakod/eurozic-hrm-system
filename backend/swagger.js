const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Neurozic HRM API',
      version: '1.0.0',
      description: 'Comprehensive Human Resource Management System API',
      contact: {
        name: 'Neurozic Software Solutions Pvt Ltd',
        email: 'contact@neurozic.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Employee: {
          type: 'object',
          required: ['name', 'email', 'employeeId', 'department', 'position', 'salary'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            name: {
              type: 'string',
              description: 'Full name of the employee',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the employee',
            },
            employeeId: {
              type: 'string',
              description: 'Unique employee identifier',
            },
            department: {
              type: 'string',
              enum: ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Support'],
              description: 'Department of the employee',
            },
            position: {
              type: 'string',
              description: 'Job position/title',
            },
            salary: {
              type: 'number',
              description: 'Annual salary',
            },
            joinDate: {
              type: 'string',
              format: 'date',
              description: 'Date when employee joined',
            },
            status: {
              type: 'string',
              enum: ['Active', 'Inactive', 'Terminated'],
              default: 'Active',
              description: 'Current status of the employee',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            address: {
              type: 'string',
              description: 'Address',
            },
            manager: {
              type: 'string',
              description: 'Manager ID reference',
            },
          },
        },
        Leave: {
          type: 'object',
          required: ['employeeId', 'type', 'startDate', 'endDate', 'reason'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            employeeId: {
              type: 'string',
              description: 'Reference to Employee ID',
            },
            type: {
              type: 'string',
              enum: ['Annual', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Emergency'],
              description: 'Type of leave',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Leave start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Leave end date',
            },
            reason: {
              type: 'string',
              description: 'Reason for leave',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Approved', 'Rejected'],
              default: 'Pending',
              description: 'Leave status',
            },
            appliedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when leave was applied',
            },
            approvedBy: {
              type: 'string',
              description: 'ID of approver',
            },
            approvalDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when leave was approved/rejected',
            },
            comments: {
              type: 'string',
              description: 'Additional comments',
            },
          },
        },
        Payroll: {
          type: 'object',
          required: ['employeeId', 'month', 'year', 'baseSalary', 'daysWorked', 'totalDays'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            employeeId: {
              type: 'string',
              description: 'Reference to Employee ID',
            },
            month: {
              type: 'string',
              enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              description: 'Payroll month',
            },
            year: {
              type: 'integer',
              minimum: 2020,
              maximum: 2030,
              description: 'Payroll year',
            },
            baseSalary: {
              type: 'number',
              description: 'Base salary amount',
            },
            allowances: {
              type: 'number',
              default: 0,
              description: 'Total allowances',
            },
            deductions: {
              type: 'number',
              default: 0,
              description: 'Total deductions',
            },
            daysWorked: {
              type: 'integer',
              minimum: 0,
              maximum: 31,
              description: 'Number of days worked',
            },
            totalDays: {
              type: 'integer',
              minimum: 1,
              maximum: 31,
              description: 'Total working days in month',
            },
            netSalary: {
              type: 'number',
              description: 'Calculated net salary',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Processed'],
              default: 'Pending',
              description: 'Payroll status',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (hashed)',
            },
            role: {
              type: 'string',
              enum: ['Admin', 'HR Manager', 'Manager', 'Employee'],
              description: 'User role',
            },
            department: {
              type: 'string',
              description: 'Department',
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Account status',
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success', 'error'],
              description: 'Response status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Validation errors',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success', 'error'],
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                },
                limit: {
                  type: 'integer',
                },
                total: {
                  type: 'integer',
                },
                pages: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
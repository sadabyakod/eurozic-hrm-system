const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validatePayroll = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('month').isIn(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']).withMessage('Valid month is required'),
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Valid year is required'),
  body('baseSalary').isNumeric().withMessage('Valid base salary is required'),
  body('daysWorked').isInt({ min: 0, max: 31 }).withMessage('Valid days worked is required'),
  body('totalDays').isInt({ min: 1, max: 31 }).withMessage('Valid total days is required')
];

// GET /api/payroll - Get all payroll records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, month, year, employeeId, status } = req.query;
    const query = {};
    
    // Add filters
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;
    
    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'name email employeeId department position')
      .populate('processedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ year: -1, month: -1 });
    
    const total = await Payroll.countDocuments(query);
    
    res.json({
      status: 'success',
      data: payrolls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/payroll/:id - Get payroll record by ID
router.get('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department position')
      .populate('processedBy', 'name email');
    
    if (!payroll) {
      return res.status(404).json({
        status: 'error',
        message: 'Payroll record not found'
      });
    }
    
    res.json({
      status: 'success',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/payroll - Create new payroll record
router.post('/', validatePayroll, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    // Verify employee exists
    const employee = await Employee.findById(req.body.employeeId);
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }
    
    // Check if payroll already exists for this employee, month, and year
    const existingPayroll = await Payroll.findOne({
      employeeId: req.body.employeeId,
      month: req.body.month,
      year: req.body.year
    });
    
    if (existingPayroll) {
      return res.status(400).json({
        status: 'error',
        message: 'Payroll record already exists for this employee in the specified month and year'
      });
    }
    
    const payroll = new Payroll(req.body);
    await payroll.save();
    
    await payroll.populate('employeeId', 'name email employeeId department position');
    
    res.status(201).json({
      status: 'success',
      message: 'Payroll record created successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/payroll/:id - Update payroll record
router.put('/:id', validatePayroll, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department position')
     .populate('processedBy', 'name email');
    
    if (!payroll) {
      return res.status(404).json({
        status: 'error',
        message: 'Payroll record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Payroll record updated successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/payroll/:id/process - Process payroll
router.patch('/:id/process', async (req, res) => {
  try {
    const { processedBy } = req.body;
    
    if (!processedBy) {
      return res.status(400).json({
        status: 'error',
        message: 'Processed by field is required'
      });
    }
    
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Processed',
        processedBy,
        processedDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department position')
     .populate('processedBy', 'name email');
    
    if (!payroll) {
      return res.status(404).json({
        status: 'error',
        message: 'Payroll record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Payroll processed successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/payroll/:id - Delete payroll record
router.delete('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    
    if (!payroll) {
      return res.status(404).json({
        status: 'error',
        message: 'Payroll record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Payroll record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/payroll/employee/:employeeId - Get payroll records for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { page = 1, limit = 10, year, status } = req.query;
    const query = { employeeId: req.params.employeeId };
    
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    
    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'name email employeeId department position')
      .populate('processedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ year: -1, month: -1 });
    
    const total = await Payroll.countDocuments(query);
    
    res.json({
      status: 'success',
      data: payrolls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/payroll/bulk-generate - Generate payroll for all employees
router.post('/bulk-generate', async (req, res) => {
  try {
    const { month, year, processedBy } = req.body;
    
    if (!month || !year || !processedBy) {
      return res.status(400).json({
        status: 'error',
        message: 'Month, year, and processedBy are required'
      });
    }
    
    // Get all active employees
    const employees = await Employee.find({ status: 'Active' });
    
    const payrollPromises = employees.map(async (employee) => {
      // Check if payroll already exists
      const existingPayroll = await Payroll.findOne({
        employeeId: employee._id,
        month,
        year
      });
      
      if (!existingPayroll) {
        const payroll = new Payroll({
          employeeId: employee._id,
          month,
          year,
          baseSalary: employee.salary,
          allowances: 0,
          deductions: 0,
          daysWorked: 30, // Default to full month
          totalDays: 30,
          processedBy
        });
        
        return await payroll.save();
      }
      return null;
    });
    
    const results = await Promise.all(payrollPromises);
    const createdPayrolls = results.filter(p => p !== null);
    
    res.json({
      status: 'success',
      message: `Generated ${createdPayrolls.length} payroll records`,
      data: {
        created: createdPayrolls.length,
        total: employees.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/payroll/stats/dashboard - Get payroll statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const totalPayrolls = await Payroll.countDocuments();
    const processedPayrolls = await Payroll.countDocuments({ status: 'Processed' });
    const pendingPayrolls = await Payroll.countDocuments({ status: 'Pending' });
    
    const currentMonthPayrolls = await Payroll.countDocuments({
      month: currentMonth,
      year: currentYear
    });
    
    const totalSalaryPaid = await Payroll.aggregate([
      { $match: { status: 'Processed' } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]);
    
    const monthlyStats = await Payroll.aggregate([
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$netSalary' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    
    res.json({
      status: 'success',
      data: {
        totalPayrolls,
        processedPayrolls,
        pendingPayrolls,
        currentMonthPayrolls,
        totalSalaryPaid: totalSalaryPaid[0]?.total || 0,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
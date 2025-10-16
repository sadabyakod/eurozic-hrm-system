const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateLeave = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('type').isIn(['Annual', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Emergency']).withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().isLength({ min: 1 }).withMessage('Reason is required')
];

// GET /api/leaves - Get all leave requests
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, employeeId } = req.query;
    const query = {};
    
    // Add filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (employeeId) query.employeeId = employeeId;
    
    const leaves = await Leave.find(query)
      .populate('employeeId', 'name email employeeId department')
      .populate('approvedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });
    
    const total = await Leave.countDocuments(query);
    
    res.json({
      status: 'success',
      data: leaves,
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

// GET /api/leaves/:id - Get leave request by ID
router.get('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department')
      .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      status: 'success',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/leaves - Create new leave request
router.post('/', validateLeave, async (req, res) => {
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
    
    // Check for overlapping leave requests
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    const overlappingLeave = await Leave.findOne({
      employeeId: req.body.employeeId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });
    
    if (overlappingLeave) {
      return res.status(400).json({
        status: 'error',
        message: 'Leave request overlaps with existing leave'
      });
    }
    
    const leave = new Leave(req.body);
    await leave.save();
    
    await leave.populate('employeeId', 'name email employeeId department');
    
    res.status(201).json({
      status: 'success',
      message: 'Leave request created successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/leaves/:id - Update leave request
router.put('/:id', validateLeave, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department')
     .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Leave request updated successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/leaves/:id/approve - Approve leave request
router.patch('/:id/approve', async (req, res) => {
  try {
    const { approvedBy, comments } = req.body;
    
    if (!approvedBy) {
      return res.status(400).json({
        status: 'error',
        message: 'Approved by field is required'
      });
    }
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy,
        approvalDate: new Date(),
        comments
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department')
     .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Leave request approved successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/leaves/:id/reject - Reject leave request
router.patch('/:id/reject', async (req, res) => {
  try {
    const { approvedBy, comments } = req.body;
    
    if (!approvedBy) {
      return res.status(400).json({
        status: 'error',
        message: 'Approved by field is required'
      });
    }
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        approvedBy,
        approvalDate: new Date(),
        comments
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department')
     .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Leave request rejected successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/leaves/:id - Delete leave request
router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    
    if (!leave) {
      return res.status(404).json({
        status: 'error',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/leaves/employee/:employeeId - Get leave requests for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const query = { employeeId: req.params.employeeId };
    
    if (status) query.status = status;
    if (type) query.type = type;
    
    const leaves = await Leave.find(query)
      .populate('employeeId', 'name email employeeId department')
      .populate('approvedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });
    
    const total = await Leave.countDocuments(query);
    
    res.json({
      status: 'success',
      data: leaves,
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

// GET /api/leaves/stats/dashboard - Get leave statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });
    
    const leaveTypeStats = await Leave.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const recentLeaves = await Leave.find()
      .populate('employeeId', 'name department')
      .sort({ appliedDate: -1 })
      .limit(5)
      .select('type startDate endDate status appliedDate');
    
    res.json({
      status: 'success',
      data: {
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        leaveTypeStats,
        recentLeaves
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
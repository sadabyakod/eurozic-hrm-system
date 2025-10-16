const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateReview = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('reviewerId').isMongoId().withMessage('Valid reviewer ID is required'),
  body('period').isIn(['Q1', 'Q2', 'Q3', 'Q4', 'Mid-Year', 'Annual']).withMessage('Valid period is required'),
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Valid year is required'),
  body('goals').isArray({ min: 1 }).withMessage('At least one goal is required'),
  body('overallRating').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5')
];

// GET /api/reviews - Get all performance reviews
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, period, year, employeeId, reviewerId } = req.query;
    const query = {};
    
    // Add filters
    if (status) query.status = status;
    if (period) query.period = period;
    if (year) query.year = parseInt(year);
    if (employeeId) query.employeeId = employeeId;
    if (reviewerId) query.reviewerId = reviewerId;
    
    const reviews = await Review.find(query)
      .populate('employeeId', 'name email employeeId department position')
      .populate('reviewerId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ reviewDate: -1 });
    
    const total = await Review.countDocuments(query);
    
    res.json({
      status: 'success',
      data: reviews,
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

// GET /api/reviews/:id - Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department position')
      .populate('reviewerId', 'name email');
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Performance review not found'
      });
    }
    
    res.json({
      status: 'success',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/reviews - Create new performance review
router.post('/', validateReview, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    // Verify employee and reviewer exist
    const employee = await Employee.findById(req.body.employeeId);
    const reviewer = await Employee.findById(req.body.reviewerId);
    
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found'
      });
    }
    
    if (!reviewer) {
      return res.status(404).json({
        status: 'error',
        message: 'Reviewer not found'
      });
    }
    
    // Check if review already exists for this employee, period, and year
    const existingReview = await Review.findOne({
      employeeId: req.body.employeeId,
      period: req.body.period,
      year: req.body.year
    });
    
    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'Performance review already exists for this employee in the specified period and year'
      });
    }
    
    const review = new Review(req.body);
    await review.save();
    
    await review.populate('employeeId', 'name email employeeId department position');
    await review.populate('reviewerId', 'name email');
    
    res.status(201).json({
      status: 'success',
      message: 'Performance review created successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/reviews/:id - Update performance review
router.put('/:id', validateReview, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department position')
     .populate('reviewerId', 'name email');
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Performance review not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Performance review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/reviews/:id/complete - Complete review
router.patch('/:id/complete', async (req, res) => {
  try {
    const { developmentPlan, nextReviewDate } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        developmentPlan,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
        completedDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department position')
     .populate('reviewerId', 'name email');
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Performance review not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Performance review completed successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/reviews/:id/approve - Approve review
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department position')
     .populate('reviewerId', 'name email');
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Performance review not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Performance review approved successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/reviews/:id - Delete performance review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Performance review not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Performance review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/reviews/employee/:employeeId - Get reviews for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { page = 1, limit = 10, year, status } = req.query;
    const query = { employeeId: req.params.employeeId };
    
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    
    const reviews = await Review.find(query)
      .populate('employeeId', 'name email employeeId department position')
      .populate('reviewerId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ reviewDate: -1 });
    
    const total = await Review.countDocuments(query);
    
    res.json({
      status: 'success',
      data: reviews,
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

// GET /api/reviews/stats/dashboard - Get review statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'Pending' });
    const completedReviews = await Review.countDocuments({ status: 'Completed' });
    const approvedReviews = await Review.countDocuments({ status: 'Approved' });
    
    const averageRating = await Review.aggregate([
      { $match: { status: { $in: ['Completed', 'Approved'] } } },
      { $group: { _id: null, avg: { $avg: '$overallRating' } } }
    ]);
    
    const ratingDistribution = await Review.aggregate([
      { $match: { status: { $in: ['Completed', 'Approved'] } } },
      { $group: { _id: '$overallRating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const departmentPerformance = await Review.aggregate([
      { $match: { status: { $in: ['Completed', 'Approved'] } } },
      { 
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      { 
        $group: {
          _id: '$employee.department',
          avgRating: { $avg: '$overallRating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1 } }
    ]);
    
    const upcomingReviews = await Review.find({
      nextReviewDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    })
      .populate('employeeId', 'name email department')
      .sort({ nextReviewDate: 1 })
      .limit(5);
    
    res.json({
      status: 'success',
      data: {
        totalReviews,
        pendingReviews,
        completedReviews,
        approvedReviews,
        averageRating: averageRating[0]?.avg || 0,
        ratingDistribution,
        departmentPerformance,
        upcomingReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/reviews/reports/performance-trends - Get performance trends
router.get('/reports/performance-trends', async (req, res) => {
  try {
    const { employeeId, startYear, endYear } = req.query;
    const query = {};
    
    if (employeeId) query.employeeId = employeeId;
    if (startYear && endYear) {
      query.year = { $gte: parseInt(startYear), $lte: parseInt(endYear) };
    }
    
    const trends = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: { year: '$year', period: '$period' },
          avgRating: { $avg: '$overallRating' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.period': 1 } }
    ]);
    
    res.json({
      status: 'success',
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
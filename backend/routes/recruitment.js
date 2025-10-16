const express = require('express');
const router = express.Router();
const Recruitment = require('../models/Recruitment');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRecruitment = [
  body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('department').isIn(['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Support']).withMessage('Valid department is required'),
  body('candidateName').trim().isLength({ min: 1 }).withMessage('Candidate name is required'),
  body('candidateEmail').isEmail().withMessage('Valid candidate email is required'),
  body('experience').isNumeric().withMessage('Valid experience is required'),
  body('expectedSalary').isNumeric().withMessage('Valid expected salary is required')
];

// GET /api/recruitment - Get all recruitment records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, department, stage } = req.query;
    const query = {};
    
    // Add filters
    if (status) query.status = status;
    if (department) query.department = department;
    if (stage) query.stage = stage;
    
    const recruitments = await Recruitment.find(query)
      .populate('interviewers', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 });
    
    const total = await Recruitment.countDocuments(query);
    
    res.json({
      status: 'success',
      data: recruitments,
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

// GET /api/recruitment/:id - Get recruitment record by ID
router.get('/:id', async (req, res) => {
  try {
    const recruitment = await Recruitment.findById(req.params.id)
      .populate('interviewers', 'name email');
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      data: recruitment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/recruitment - Create new recruitment record
router.post('/', validateRecruitment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const recruitment = new Recruitment(req.body);
    await recruitment.save();
    
    await recruitment.populate('interviewers', 'name email');
    
    res.status(201).json({
      status: 'success',
      message: 'Recruitment record created successfully',
      data: recruitment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Candidate email already exists in the system'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/recruitment/:id - Update recruitment record
router.put('/:id', validateRecruitment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('interviewers', 'name email');
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Recruitment record updated successfully',
      data: recruitment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/recruitment/:id/stage - Update recruitment stage
router.patch('/:id/stage', async (req, res) => {
  try {
    const { stage, notes } = req.body;
    
    const validStages = ['Applied', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Offer Extended', 'Hired', 'Rejected'];
    
    if (!stage || !validStages.includes(stage)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid stage is required'
      });
    }
    
    const updateData = { stage };
    if (notes) updateData.notes = notes;
    
    // Update status based on stage
    if (stage === 'Hired') {
      updateData.status = 'Hired';
    } else if (stage === 'Rejected') {
      updateData.status = 'Rejected';
    } else {
      updateData.status = 'In Progress';
    }
    
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('interviewers', 'name email');
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Recruitment stage updated successfully',
      data: recruitment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/recruitment/:id/schedule-interview - Schedule interview
router.patch('/:id/schedule-interview', async (req, res) => {
  try {
    const { interviewDate, interviewers, interviewType } = req.body;
    
    if (!interviewDate || !interviewers || !interviewType) {
      return res.status(400).json({
        status: 'error',
        message: 'Interview date, interviewers, and interview type are required'
      });
    }
    
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      {
        interviewDate: new Date(interviewDate),
        interviewers,
        interviewType,
        stage: 'Technical Interview' // Update stage when interview is scheduled
      },
      { new: true, runValidators: true }
    ).populate('interviewers', 'name email');
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Interview scheduled successfully',
      data: recruitment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/recruitment/:id/add-feedback - Add interview feedback
router.patch('/:id/add-feedback', async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    
    if (!feedback) {
      return res.status(400).json({
        status: 'error',
        message: 'Feedback is required'
      });
    }
    
    const recruitment = await Recruitment.findByIdAndUpdate(
      req.params.id,
      {
        $push: { 
          feedback: {
            feedback,
            rating: rating || null,
            date: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('interviewers', 'name email');
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Feedback added successfully',
      data: recruitment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/recruitment/:id - Delete recruitment record
router.delete('/:id', async (req, res) => {
  try {
    const recruitment = await Recruitment.findByIdAndDelete(req.params.id);
    
    if (!recruitment) {
      return res.status(404).json({
        status: 'error',
        message: 'Recruitment record not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Recruitment record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/recruitment/stats/dashboard - Get recruitment statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalApplications = await Recruitment.countDocuments();
    const activeApplications = await Recruitment.countDocuments({ status: 'In Progress' });
    const hiredCandidates = await Recruitment.countDocuments({ status: 'Hired' });
    const rejectedCandidates = await Recruitment.countDocuments({ status: 'Rejected' });
    
    const departmentStats = await Recruitment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const stageStats = await Recruitment.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const recentApplications = await Recruitment.find()
      .sort({ appliedDate: -1 })
      .limit(5)
      .select('candidateName jobTitle department stage appliedDate status');
    
    const upcomingInterviews = await Recruitment.find({
      interviewDate: { $gte: new Date() },
      status: 'In Progress'
    })
      .populate('interviewers', 'name email')
      .sort({ interviewDate: 1 })
      .limit(5)
      .select('candidateName jobTitle interviewDate interviewType');
    
    res.json({
      status: 'success',
      data: {
        totalApplications,
        activeApplications,
        hiredCandidates,
        rejectedCandidates,
        departmentStats,
        stageStats,
        recentApplications,
        upcomingInterviews
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/recruitment/reports/hiring-funnel - Get hiring funnel report
router.get('/reports/hiring-funnel', async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.appliedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (department) {
      query.department = department;
    }
    
    const funnelData = await Recruitment.aggregate([
      { $match: query },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
      { 
        $addFields: {
          order: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'Applied'] }, then: 1 },
                { case: { $eq: ['$_id', 'Phone Screen'] }, then: 2 },
                { case: { $eq: ['$_id', 'Technical Interview'] }, then: 3 },
                { case: { $eq: ['$_id', 'Final Interview'] }, then: 4 },
                { case: { $eq: ['$_id', 'Offer Extended'] }, then: 5 },
                { case: { $eq: ['$_id', 'Hired'] }, then: 6 },
                { case: { $eq: ['$_id', 'Rejected'] }, then: 7 }
              ],
              default: 8
            }
          }
        }
      },
      { $sort: { order: 1 } }
    ]);
    
    res.json({
      status: 'success',
      data: funnelData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
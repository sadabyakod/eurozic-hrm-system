const express = require('express');
const router = express.Router();
const OfferLetter = require('../models/OfferLetter');
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateOfferLetter = [
  body('candidateName').trim().isLength({ min: 1 }).withMessage('Candidate name is required'),
  body('candidateEmail').isEmail().withMessage('Valid candidate email is required'),
  body('position').trim().isLength({ min: 1 }).withMessage('Position is required'),
  body('department').isIn(['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Support']).withMessage('Valid department is required'),
  body('salary').isNumeric().withMessage('Valid salary is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required')
];

// GET /api/offer-letters - Get all offer letters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, department } = req.query;
    const query = {};
    
    // Add filters
    if (status) query.status = status;
    if (department) query.department = department;
    
    const offerLetters = await OfferLetter.find(query)
      .populate('approvedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdDate: -1 });
    
    const total = await OfferLetter.countDocuments(query);
    
    res.json({
      status: 'success',
      data: offerLetters,
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

// GET /api/offer-letters/:id - Get offer letter by ID
router.get('/:id', async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findById(req.params.id)
      .populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/offer-letters - Create new offer letter
router.post('/', validateOfferLetter, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    // Check if offer letter already exists for this candidate
    const existingOffer = await OfferLetter.findOne({
      candidateEmail: req.body.candidateEmail,
      status: { $in: ['Draft', 'Sent', 'Accepted'] }
    });
    
    if (existingOffer) {
      return res.status(400).json({
        status: 'error',
        message: 'Active offer letter already exists for this candidate'
      });
    }
    
    const offerLetter = new OfferLetter(req.body);
    await offerLetter.save();
    
    await offerLetter.populate('approvedBy', 'name email');
    
    res.status(201).json({
      status: 'success',
      message: 'Offer letter created successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /api/offer-letters/:id - Update offer letter
router.put('/:id', validateOfferLetter, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const offerLetter = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter updated successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/offer-letters/:id/send - Send offer letter
router.patch('/:id/send', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    
    if (!approvedBy) {
      return res.status(400).json({
        status: 'error',
        message: 'Approved by field is required'
      });
    }
    
    const offerLetter = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Sent',
        approvedBy,
        sentDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter sent successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/offer-letters/:id/accept - Accept offer letter
router.patch('/:id/accept', async (req, res) => {
  try {
    const { acceptanceDate, negotiatedSalary, candidateComments } = req.body;
    
    const updateData = {
      status: 'Accepted',
      acceptanceDate: acceptanceDate ? new Date(acceptanceDate) : new Date()
    };
    
    if (negotiatedSalary) updateData.negotiatedSalary = negotiatedSalary;
    if (candidateComments) updateData.candidateComments = candidateComments;
    
    const offerLetter = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter accepted successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/offer-letters/:id/reject - Reject offer letter
router.patch('/:id/reject', async (req, res) => {
  try {
    const { rejectionDate, rejectionReason, candidateComments } = req.body;
    
    const updateData = {
      status: 'Rejected',
      rejectionDate: rejectionDate ? new Date(rejectionDate) : new Date()
    };
    
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (candidateComments) updateData.candidateComments = candidateComments;
    
    const offerLetter = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter rejected successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PATCH /api/offer-letters/:id/withdraw - Withdraw offer letter
router.patch('/:id/withdraw', async (req, res) => {
  try {
    const { withdrawalReason } = req.body;
    
    const offerLetter = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Withdrawn',
        withdrawalDate: new Date(),
        withdrawalReason
      },
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter withdrawn successfully',
      data: offerLetter
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE /api/offer-letters/:id - Delete offer letter
router.delete('/:id', async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findByIdAndDelete(req.params.id);
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Offer letter deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/offer-letters/stats/dashboard - Get offer letter statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalOffers = await OfferLetter.countDocuments();
    const draftOffers = await OfferLetter.countDocuments({ status: 'Draft' });
    const sentOffers = await OfferLetter.countDocuments({ status: 'Sent' });
    const acceptedOffers = await OfferLetter.countDocuments({ status: 'Accepted' });
    const rejectedOffers = await OfferLetter.countDocuments({ status: 'Rejected' });
    const withdrawnOffers = await OfferLetter.countDocuments({ status: 'Withdrawn' });
    
    const departmentStats = await OfferLetter.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const averageSalary = await OfferLetter.aggregate([
      { $match: { status: { $in: ['Sent', 'Accepted'] } } },
      { $group: { _id: null, avg: { $avg: '$salary' } } }
    ]);
    
    const recentOffers = await OfferLetter.find()
      .sort({ createdDate: -1 })
      .limit(5)
      .select('candidateName position department salary status createdDate');
    
    const upcomingJoinings = await OfferLetter.find({
      status: 'Accepted',
      joiningDate: { $gte: new Date() }
    })
      .sort({ joiningDate: 1 })
      .limit(5)
      .select('candidateName position department joiningDate');
    
    const acceptanceRate = totalOffers > 0 ? (acceptedOffers / totalOffers * 100).toFixed(2) : 0;
    
    res.json({
      status: 'success',
      data: {
        totalOffers,
        draftOffers,
        sentOffers,
        acceptedOffers,
        rejectedOffers,
        withdrawnOffers,
        departmentStats,
        averageSalary: averageSalary[0]?.avg || 0,
        recentOffers,
        upcomingJoinings,
        acceptanceRate: parseFloat(acceptanceRate)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/offer-letters/generate/:id - Generate offer letter document
router.get('/generate/:id', async (req, res) => {
  try {
    const offerLetter = await OfferLetter.findById(req.params.id);
    
    if (!offerLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Offer letter not found'
      });
    }
    
    // Generate offer letter content (this is a basic template)
    const offerContent = `
OFFER LETTER

Date: ${new Date().toLocaleDateString()}

Dear ${offerLetter.candidateName},

We are pleased to offer you the position of ${offerLetter.position} in our ${offerLetter.department} department at Neurozic Software Solutions Pvt Ltd.

Position Details:
- Position: ${offerLetter.position}
- Department: ${offerLetter.department}
- Salary: $${offerLetter.salary.toLocaleString()} per annum
- Joining Date: ${new Date(offerLetter.joiningDate).toLocaleDateString()}

Benefits:
${offerLetter.benefits ? offerLetter.benefits.join('\n') : 'Standard company benefits package'}

Terms and Conditions:
${offerLetter.terms || 'Standard terms and conditions apply'}

We look forward to welcoming you to our team.

Sincerely,
Neurozic Software Solutions Pvt Ltd
HR Department
    `;
    
    res.json({
      status: 'success',
      data: {
        content: offerContent,
        offerLetter
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
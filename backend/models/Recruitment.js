const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Support']
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  requirements: {
    type: [String],
    required: [true, 'Requirements are required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  salaryRange: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: [0, 'Salary cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'On Hold', 'Filled'],
    default: 'Open'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  closingDate: {
    type: Date,
    required: [true, 'Closing date is required']
  },
  applicantsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  hiringManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Hiring manager is required']
  },
  skills: {
    type: [String],
    required: [true, 'Skills are required']
  },
  benefits: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Validation for salary range
recruitmentSchema.pre('save', function(next) {
  if (this.salaryRange.min > this.salaryRange.max) {
    next(new Error('Minimum salary cannot be greater than maximum salary'));
  }
  next();
});

module.exports = mongoose.model('Recruitment', recruitmentSchema);
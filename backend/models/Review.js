const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  employeeName: {
    type: String,
    required: [true, 'Employee name is required']
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Reviewer ID is required']
  },
  reviewerName: {
    type: String,
    required: [true, 'Reviewer name is required']
  },
  reviewPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Review period start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Review period end date is required']
    }
  },
  reviewType: {
    type: String,
    required: [true, 'Review type is required'],
    enum: ['Annual', 'Semi-Annual', 'Quarterly', 'Probation', 'Project']
  },
  overallRating: {
    type: Number,
    required: [true, 'Overall rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  categories: {
    performance: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, maxlength: 500 }
    },
    communication: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, maxlength: 500 }
    },
    teamwork: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, maxlength: 500 }
    },
    leadership: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, maxlength: 500 }
    },
    problemSolving: {
      rating: { type: Number, min: 1, max: 5, required: true },
      comments: { type: String, maxlength: 500 }
    }
  },
  strengths: {
    type: [String],
    required: [true, 'Strengths are required']
  },
  areasForImprovement: {
    type: [String],
    required: [true, 'Areas for improvement are required']
  },
  goals: {
    type: [String],
    required: [true, 'Goals are required']
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  employeeComments: {
    type: String,
    maxlength: [1000, 'Employee comments cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Draft', 'Completed', 'Acknowledged'],
    default: 'Draft'
  },
  completedDate: {
    type: Date
  },
  acknowledgedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate overall rating based on categories
reviewSchema.pre('save', function(next) {
  if (this.categories) {
    const ratings = Object.values(this.categories).map(cat => cat.rating);
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    this.overallRating = Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
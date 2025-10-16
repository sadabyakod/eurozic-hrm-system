const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  candidateEmail: {
    type: String,
    required: [true, 'Candidate email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Support']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  reportingManager: {
    type: String,
    required: [true, 'Reporting manager is required'],
    trim: true
  },
  workLocation: {
    type: String,
    required: [true, 'Work location is required'],
    trim: true
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  benefits: {
    type: [String],
    default: [
      'Health Insurance',
      'Dental Insurance',
      'Vision Insurance',
      'Retirement Plan',
      'Paid Time Off',
      'Professional Development'
    ]
  },
  terms: {
    probationPeriod: {
      type: Number,
      default: 90, // days
      min: 0
    },
    noticePeriod: {
      type: Number,
      default: 30, // days
      min: 0
    }
  },
  offerValidUntil: {
    type: Date,
    required: [true, 'Offer validity date is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'],
    default: 'Draft'
  },
  sentDate: {
    type: Date
  },
  responseDate: {
    type: Date
  },
  hrContact: {
    name: {
      type: String,
      required: [true, 'HR contact name is required']
    },
    email: {
      type: String,
      required: [true, 'HR contact email is required']
    },
    phone: {
      type: String,
      required: [true, 'HR contact phone is required']
    }
  },
  additionalNotes: {
    type: String,
    maxlength: [1000, 'Additional notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Update status based on dates
offerLetterSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-expire offers past validity date
  if (this.offerValidUntil < now && this.status === 'Sent') {
    this.status = 'Expired';
  }
  
  // Set sent date when status changes to 'Sent'
  if (this.status === 'Sent' && !this.sentDate) {
    this.sentDate = now;
  }
  
  // Set response date when status changes to 'Accepted' or 'Declined'
  if ((this.status === 'Accepted' || this.status === 'Declined') && !this.responseDate) {
    this.responseDate = now;
  }
  
  next();
});

module.exports = mongoose.model('OfferLetter', offerLetterSchema);
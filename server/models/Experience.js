const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters'],
  },
  position: {
    type: String,
    required: [true, 'Please add a position/job title'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // If endDate is provided, it must be after startDate
        if (value && this.startDate) {
          return value >= this.startDate;
        }
        return true;
      },
      message: 'End date must be after start date',
    },
  },
  current: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters'],
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'other'],
    default: 'full-time',
  },
  technologies: [{
    type: String,
    trim: true,
  }],
  achievements: [{
    type: String,
    trim: true,
  }],
  companyUrl: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL',
    ],
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
experienceSchema.index({ order: 1, startDate: -1 });
experienceSchema.index({ current: 1 });
experienceSchema.index({ company: 1 });

// Pre-save middleware
experienceSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  
  // If current is true, set endDate to null
  if (this.current) {
    this.endDate = null;
  }
  
  next();
});

// Virtual for duration
experienceSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
});

// Virtual for formatted date range
experienceSchema.virtual('dateRange').get(function() {
  const options = { year: 'numeric', month: 'short' };
  const startFormatted = this.startDate.toLocaleDateString('en-US', options);
  const endFormatted = this.endDate 
    ? this.endDate.toLocaleDateString('en-US', options)
    : 'Present';
  
  return `${startFormatted} - ${endFormatted}`;
});

// Ensure virtuals are included in JSON
experienceSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id; // Remove duplicate id field
    return ret;
  }
});

experienceSchema.set('toObject', { virtuals: true });

// Instance method to check if experience is still active
experienceSchema.methods.isActive = function() {
  return this.current === true;
};

// Instance method to get years of experience
experienceSchema.methods.getYearsOfExperience = function() {
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  return (months / 12).toFixed(1);
};

// Static method to get all current positions
experienceSchema.statics.getCurrentPositions = function() {
  return this.find({ current: true }).sort({ order: 1, startDate: -1 });
};

// Static method to get total years of experience
experienceSchema.statics.getTotalYearsOfExperience = async function() {
  const experiences = await this.find();
  
  let totalMonths = 0;
  experiences.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    totalMonths += months;
  });
  
  return (totalMonths / 12).toFixed(1);
};

// Static method to get experiences by company
experienceSchema.statics.getByCompany = function(company) {
  return this.find({ 
    company: { $regex: new RegExp(company, 'i') } 
  }).sort({ startDate: -1 });
};

module.exports = mongoose.model('Experience', experienceSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    unique: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a project description'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    required: [true, 'Please add a short description'],
    minlength: [10, 'Short description must be at least 10 characters'],
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  image: {
    type: String,
    required: [true, 'Please add a project image'],
  },
  images: [{
    type: String,
  }],
  technologies: [{
    type: String,
    required: true,
  }],
  features: [{
    type: String,
  }],
  liveUrl: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL',
    ],
  },
  githubUrl: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL',
    ],
  },
  demoUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ['web', 'mobile', 'desktop', 'fullstack', 'frontend', 'backend', 'other'],
      message: 'Category must be one of: web, mobile, desktop, fullstack, frontend, backend, other',
    },
    default: 'web',
  },
  status: {
    type: String,
    enum: {
      values: ['completed', 'in-progress', 'planned', 'archived'],
      message: 'Status must be one of: completed, in-progress, planned, archived',
    },
    default: 'completed',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  startDate: {
    type: Date,
  },
  completionDate: {
    type: Date,
  },
  duration: {
    type: String,
    trim: true,
  },
  team: [{
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  challenges: [{
    type: String,
  }],
  learnings: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
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
projectSchema.index({ title: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ order: 1, createdAt: -1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ tags: 1 });

// Text index for search functionality
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortDescription: 'text',
  technologies: 'text',
  tags: 'text',
});

// Pre-save middleware
projectSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  
  // Convert technologies to lowercase for consistency
  if (this.technologies && this.technologies.length > 0) {
    this.technologies = this.technologies.map(tech => 
      tech.trim().toLowerCase()
    );
  }
  
  // Convert tags to lowercase
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => 
      tag.trim().toLowerCase()
    );
  }
  
  next();
});

// Virtual for project URL slug
projectSchema.virtual('slug').get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
});

// Virtual for checking if project has links
projectSchema.virtual('hasLinks').get(function() {
  return !!(this.liveUrl || this.githubUrl || this.demoUrl);
});

// Virtual for technology count
projectSchema.virtual('techCount').get(function() {
  return this.technologies ? this.technologies.length : 0;
});

// Virtual to check if project is recent (within last 6 months)
projectSchema.virtual('isRecent').get(function() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return this.createdAt >= sixMonthsAgo;
});

// Ensure virtuals are included in JSON
projectSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id; // Remove duplicate id field
    return ret;
  }
});

projectSchema.set('toObject', { virtuals: true });

// Instance method to increment views
projectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
projectSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Instance method to toggle featured status
projectSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Instance method to check if project is completed
projectSchema.methods.isCompleted = function() {
  return this.status === 'completed';
};

// Instance method to get project age in days
projectSchema.methods.getAgeInDays = function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Static method to get featured projects
projectSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category, limit) {
  const query = this.find({ category }).sort({ order: 1, createdAt: -1 });
  if (limit) query.limit(limit);
  return query;
};

// Static method to get projects by technology
projectSchema.statics.getByTechnology = function(technology) {
  return this.find({ 
    technologies: { $in: [technology.toLowerCase()] } 
  }).sort({ order: 1, createdAt: -1 });
};

// Static method to search projects
projectSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ 
    score: { $meta: 'textScore' } 
  });
};

// Static method to get recent projects
projectSchema.statics.getRecent = function(limit = 6) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get popular projects (by views)
projectSchema.statics.getPopular = function(limit = 6) {
  return this.find()
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Static method to get project statistics
projectSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const featured = await this.countDocuments({ featured: true });
  const completed = await this.countDocuments({ status: 'completed' });
  const inProgress = await this.countDocuments({ status: 'in-progress' });
  
  // Get all unique technologies
  const projects = await this.find();
  const allTech = projects.reduce((acc, project) => {
    return [...acc, ...project.technologies];
  }, []);
  const uniqueTech = [...new Set(allTech)];
  
  // Get category breakdown
  const categories = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    total,
    featured,
    completed,
    inProgress,
    totalTechnologies: uniqueTech.length,
    categories,
  };
};

module.exports = mongoose.model('Project', projectSchema);
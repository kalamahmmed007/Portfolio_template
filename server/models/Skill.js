const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true,
    minlength: [2, 'Skill name must be at least 2 characters'],
    maxlength: [50, 'Skill name cannot exceed 50 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please add a skill category'],
    enum: {
      values: ['frontend', 'backend', 'database', 'devops', 'mobile', 'tools', 'design', 'other'],
      message: 'Category must be one of: frontend, backend, database, devops, mobile, tools, design, other',
    },
  },
  proficiency: {
    type: Number,
    min: [0, 'Proficiency cannot be less than 0'],
    max: [100, 'Proficiency cannot exceed 100'],
    default: 50,
  },
  level: {
    type: String,
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'expert'],
      message: 'Level must be one of: beginner, intermediate, advanced, expert',
    },
    default: 'intermediate',
  },
  icon: {
    type: String,
    default: '',
    trim: true,
  },
  color: {
    type: String,
    default: '#3B82F6',
    trim: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    default: 0,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  certifications: [{
    name: {
      type: String,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    url: {
      type: String,
      trim: true,
    },
  }],
  resources: [{
    title: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['documentation', 'tutorial', 'course', 'book', 'other'],
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  lastUsed: {
    type: Date,
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
skillSchema.index({ name: 1 }, { unique: true });
skillSchema.index({ category: 1 });
skillSchema.index({ proficiency: -1 });
skillSchema.index({ featured: 1 });
skillSchema.index({ visible: 1 });
skillSchema.index({ order: 1, name: 1 });

// Text index for search
skillSchema.index({ 
  name: 'text', 
  description: 'text',
  tags: 'text',
});

// Pre-save middleware
skillSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  
  // Auto-set level based on proficiency
  if (this.isModified('proficiency')) {
    if (this.proficiency < 25) {
      this.level = 'beginner';
    } else if (this.proficiency < 50) {
      this.level = 'intermediate';
    } else if (this.proficiency < 80) {
      this.level = 'advanced';
    } else {
      this.level = 'expert';
    }
  }
  
  // Normalize skill name (capitalize first letter)
  if (this.isModified('name')) {
    this.name = this.name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Convert tags to lowercase
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.trim().toLowerCase());
  }
  
  next();
});

// Virtual for proficiency percentage display
skillSchema.virtual('proficiencyDisplay').get(function() {
  return `${this.proficiency}%`;
});

// Virtual for proficiency level description
skillSchema.virtual('proficiencyLabel').get(function() {
  if (this.proficiency < 25) return 'Beginner';
  if (this.proficiency < 50) return 'Intermediate';
  if (this.proficiency < 80) return 'Advanced';
  return 'Expert';
});

// Virtual to check if skill is recently used (within last year)
skillSchema.virtual('isRecentlyUsed').get(function() {
  if (!this.lastUsed) return false;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return this.lastUsed >= oneYearAgo;
});

// Virtual for project count
skillSchema.virtual('projectCount').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Ensure virtuals are included in JSON
skillSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id; // Remove duplicate id field
    return ret;
  }
});

skillSchema.set('toObject', { virtuals: true });

// Instance method to update proficiency
skillSchema.methods.updateProficiency = function(newProficiency) {
  if (newProficiency < 0 || newProficiency > 100) {
    throw new Error('Proficiency must be between 0 and 100');
  }
  this.proficiency = newProficiency;
  return this.save();
};

// Instance method to toggle featured status
skillSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Instance method to toggle visibility
skillSchema.methods.toggleVisibility = function() {
  this.visible = !this.visible;
  return this.save();
};

// Instance method to mark as recently used
skillSchema.methods.markAsUsed = function() {
  this.lastUsed = new Date();
  return this.save();
};

// Instance method to add project reference
skillSchema.methods.addProject = function(projectId) {
  if (!this.projects.includes(projectId)) {
    this.projects.push(projectId);
    return this.save();
  }
  return this;
};

// Instance method to remove project reference
skillSchema.methods.removeProject = function(projectId) {
  this.projects = this.projects.filter(id => id.toString() !== projectId.toString());
  return this.save();
};

// Instance method to check if skill is high proficiency
skillSchema.methods.isHighProficiency = function() {
  return this.proficiency >= 80;
};

// Static method to get skills by category
skillSchema.statics.getByCategory = function(category) {
  return this.find({ category, visible: true })
    .sort({ order: 1, proficiency: -1 });
};

// Static method to get featured skills
skillSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true, visible: true })
    .sort({ proficiency: -1, order: 1 })
    .limit(limit);
};

// Static method to get top skills by proficiency
skillSchema.statics.getTopSkills = function(limit = 10) {
  return this.find({ visible: true })
    .sort({ proficiency: -1, name: 1 })
    .limit(limit);
};

// Static method to get skills grouped by category
skillSchema.statics.getGroupedByCategory = async function() {
  const skills = await this.find({ visible: true })
    .sort({ order: 1, proficiency: -1 });
  
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

// Static method to get skill statistics
skillSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const visible = await this.countDocuments({ visible: true });
  const featured = await this.countDocuments({ featured: true });
  
  // Average proficiency
  const avgResult = await this.aggregate([
    { $match: { visible: true } },
    { 
      $group: {
        _id: null,
        avgProficiency: { $avg: '$proficiency' }
      }
    }
  ]);
  
  const avgProficiency = avgResult.length > 0 
    ? Math.round(avgResult[0].avgProficiency) 
    : 0;
  
  // Category breakdown
  const categories = await this.aggregate([
    { $match: { visible: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgProficiency: { $avg: '$proficiency' }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  // Level distribution
  const levels = await this.aggregate([
    { $match: { visible: true } },
    {
      $group: {
        _id: '$level',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    total,
    visible,
    featured,
    avgProficiency,
    categories,
    levels,
  };
};

// Static method to search skills
skillSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    visible: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({ 
    score: { $meta: 'textScore' } 
  });
};

// Static method to get recently used skills
skillSchema.statics.getRecentlyUsed = function(limit = 10) {
  return this.find({ 
    visible: true,
    lastUsed: { $exists: true, $ne: null }
  })
    .sort({ lastUsed: -1 })
    .limit(limit);
};

// Static method to update multiple skill orders
skillSchema.statics.reorderSkills = async function(skillOrders) {
  const bulkOps = skillOrders.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order } }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Skill', skillSchema);
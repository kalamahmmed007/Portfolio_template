const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: 'Role must be one of: user, admin, moderator',
    },
    default: 'user',
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please provide a valid phone number',
    ],
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid URL',
    ],
  },
  location: {
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  social: {
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
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
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware - Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update updatedAt timestamp
    this.updatedAt = Date.now();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware - Update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full location
userSchema.virtual('fullLocation').get(function() {
  if (this.location && this.location.city && this.location.country) {
    return `${this.location.city}, ${this.location.country}`;
  }
  if (this.location && this.location.city) {
    return this.location.city;
  }
  if (this.location && this.location.country) {
    return this.location.country;
  }
  return '';
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual to get initials
userSchema.virtual('initials').get(function() {
  if (!this.name) return '';
  const names = this.name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id; // Remove duplicate id field
    delete ret.password; // Never send password
    delete ret.verificationToken;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  }
});

userSchema.set('toObject', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

// Instance method - Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method - Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Instance method - Check if user is moderator or admin
userSchema.methods.isModerator = function() {
  return this.role === 'moderator' || this.role === 'admin';
};

// Instance method - Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  this.loginAttempts = 0; // Reset login attempts on successful login
  return this.save();
};

// Instance method - Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  // Otherwise increment login attempts
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Instance method - Generate reset password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Instance method - Generate verification token
userSchema.methods.generateVerificationToken = function() {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(20).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return verificationToken;
};

// Instance method - Verify account
userSchema.methods.verifyAccount = function() {
  this.isVerified = true;
  this.verificationToken = undefined;
  return this.save();
};

// Static method - Get all admins
userSchema.statics.getAdmins = function() {
  return this.find({ role: 'admin', isActive: true });
};

// Static method - Get user count
userSchema.statics.getUserCount = async function() {
  return this.countDocuments({ isActive: true });
};

// Static method - Get users registered in last X days
userSchema.statics.getRecentUsers = function(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  return this.find({ 
    createdAt: { $gte: date },
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method - Get user statistics
userSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ isActive: true });
  const verified = await this.countDocuments({ isVerified: true });
  const admins = await this.countDocuments({ role: 'admin' });
  
  // Get users registered in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await this.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  return {
    total,
    active,
    verified,
    admins,
    recentUsers,
  };
};

// Static method - Search users
userSchema.statics.searchUsers = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
    isActive: true
  });
};

module.exports = mongoose.model('User', userSchema);
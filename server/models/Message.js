const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please add a valid phone number',
    ],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  repliedAt: {
    type: Date,
  },
  replyMessage: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  category: {
    type: String,
    enum: ['general', 'project', 'collaboration', 'job', 'other'],
    default: 'general',
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  starred: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
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
messageSchema.index({ read: 1, createdAt: -1 });
messageSchema.index({ email: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ starred: 1 });
messageSchema.index({ archived: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ category: 1 });

// Text index for searching
messageSchema.index({ 
  name: 'text', 
  email: 'text', 
  subject: 'text', 
  message: 'text' 
});

// Pre-save middleware
messageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set repliedAt timestamp when replied status changes to true
  if (this.isModified('replied') && this.replied && !this.repliedAt) {
    this.repliedAt = Date.now();
  }
  
  next();
});

// Virtual for time since creation
messageSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return created.toLocaleDateString();
});

// Virtual for formatted date
messageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Virtual for message preview (first 100 characters)
messageSchema.virtual('preview').get(function() {
  return this.message.length > 100 
    ? this.message.substring(0, 100) + '...'
    : this.message;
});

// Virtual for status
messageSchema.virtual('status').get(function() {
  if (this.archived) return 'archived';
  if (this.replied) return 'replied';
  if (this.read) return 'read';
  return 'unread';
});

// Ensure virtuals are included in JSON
messageSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id; // Remove duplicate id field
    return ret;
  }
});

messageSchema.set('toObject', { virtuals: true });

// Instance method to mark as read
messageSchema.methods.markAsRead = async function() {
  this.read = true;
  return await this.save();
};

// Instance method to mark as unread
messageSchema.methods.markAsUnread = async function() {
  this.read = false;
  return await this.save();
};

// Instance method to archive
messageSchema.methods.archive = async function() {
  this.archived = true;
  return await this.save();
};

// Instance method to unarchive
messageSchema.methods.unarchive = async function() {
  this.archived = false;
  return await this.save();
};

// Instance method to toggle star
messageSchema.methods.toggleStar = async function() {
  this.starred = !this.starred;
  return await this.save();
};

// Instance method to reply
messageSchema.methods.reply = async function(replyText) {
  this.replied = true;
  this.repliedAt = Date.now();
  this.replyMessage = replyText;
  this.read = true; // Auto-mark as read when replying
  return await this.save();
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ read: false, archived: false });
};

// Static method to get starred messages
messageSchema.statics.getStarred = function() {
  return this.find({ starred: true, archived: false })
    .sort({ createdAt: -1 });
};

// Static method to get messages by priority
messageSchema.statics.getByPriority = function(priority) {
  return this.find({ priority, archived: false })
    .sort({ createdAt: -1 });
};

// Static method to get messages by category
messageSchema.statics.getByCategory = function(category) {
  return this.find({ category, archived: false })
    .sort({ createdAt: -1 });
};

// Static method to search messages
messageSchema.statics.searchMessages = function(searchTerm) {
  return this.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Static method to get recent messages
messageSchema.statics.getRecent = function(limit = 10) {
  return this.find({ archived: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get messages by date range
messageSchema.statics.getByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
    archived: false,
  }).sort({ createdAt: -1 });
};

// Static method to get statistics
messageSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const unread = await this.countDocuments({ read: false, archived: false });
  const read = await this.countDocuments({ read: true, archived: false });
  const replied = await this.countDocuments({ replied: true });
  const archived = await this.countDocuments({ archived: true });
  const starred = await this.countDocuments({ starred: true });
  
  // Get messages from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const lastWeek = await this.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  
  // Get messages from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const lastMonth = await this.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  
  return {
    total,
    unread,
    read,
    replied,
    archived,
    starred,
    lastWeek,
    lastMonth,
  };
};

module.exports = mongoose.model('Message', messageSchema)
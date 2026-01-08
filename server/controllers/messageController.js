const Message = require('../models/Message');
const { sendContactNotification } = require('../utils/email');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
  try {
    const { read, limit, sort, search } = req.query;

    // Build query
    let query = {};

    // Filter by read status
    if (read !== undefined) {
      query.read = read === 'true';
    }

    // Search by name, email, or subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Build the find query
    let messagesQuery = Message.find(query);

    // Sorting
    if (sort === 'oldest') {
      messagesQuery = messagesQuery.sort({ createdAt: 1 });
    } else {
      // Default: newest first
      messagesQuery = messagesQuery.sort({ createdAt: -1 });
    }

    // Limit results
    if (limit) {
      messagesQuery = messagesQuery.limit(parseInt(limit));
    }

    const messages = await messagesQuery;

    // Get counts
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });

    res.json({
      success: true,
      count: messages.length,
      total: totalMessages,
      unread: unreadMessages,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private/Admin
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Auto-mark as read when viewed
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new message (Contact form submission)
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Create message
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send email notification (optional - won't fail if email not configured)
    try {
      if (process.env.SMTP_EMAIL) {
        await sendContactNotification(newMessage);
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError.message);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        _id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message (mark as read/unread)
// @route   PUT /api/messages/:id
// @access  Private/Admin
exports.updateMessage = async (req, res, next) => {
  try {
    let message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Update message
    message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.read = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as unread
// @route   PUT /api/messages/:id/unread
// @access  Private/Admin
exports.markAsUnread = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.read = false;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as unread',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark multiple messages as read
// @route   PUT /api/messages/bulk/read
// @access  Private/Admin
exports.bulkMarkAsRead = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of message IDs',
      });
    }

    await Message.updateMany(
      { _id: { $in: ids } },
      { read: true }
    );

    res.json({
      success: true,
      message: `${ids.length} message(s) marked as read`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete multiple messages
// @route   DELETE /api/messages/bulk/delete
// @access  Private/Admin
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of message IDs',
      });
    }

    const result = await Message.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} message(s) deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message statistics
// @route   GET /api/messages/stats/summary
// @access  Private/Admin
exports.getMessageStats = async (req, res, next) => {
  try {
    const totalMessages = await Message.countDocuments();
    const readMessages = await Message.countDocuments({ read: true });
    const unreadMessages = await Message.countDocuments({ read: false });

    // Get messages from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get messages from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyMessages = await Message.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalMessages,
        readMessages,
        unreadMessages,
        recentMessages, // Last 7 days
        monthlyMessages, // Last 30 days
      },
    });
  } catch (error) {
    next(error);
  }
};
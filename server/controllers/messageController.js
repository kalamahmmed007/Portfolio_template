const Message = require('../models/Message');
const { sendEmail } = require('../utils/email');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { read, replied } = req.query;
    let query = {};

    if (read) query.read = read === 'true';
    if (replied) query.replied = replied === 'true';

    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      // Mark as read
      if (!message.read) {
        message.read = true;
        await message.save();
      }
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create message (Contact form)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);

    // Send notification email to admin (optional)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Message: ${req.body.subject}`,
        text: `
          You have received a new message from your portfolio contact form:
          
          Name: ${req.body.name}
          Email: ${req.body.email}
          Subject: ${req.body.subject}
          
          Message:
          ${req.body.message}
        `,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Subject:</strong> ${req.body.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${req.body.message}</p>
        `,
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private
const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message stats
// @route   GET /api/messages/stats
// @access  Private
const getMessageStats = async (req, res) => {
  try {
    const total = await Message.countDocuments();
    const unread = await Message.countDocuments({ read: false });
    const replied = await Message.countDocuments({ replied: true });

    res.json({
      total,
      unread,
      replied,
      pending: total - replied,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessageStats,
};
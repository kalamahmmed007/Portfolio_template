const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  markAsUnread,
  bulkMarkAsRead,
  bulkDelete,
  getMessageStats,
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');
const { validateMessage, validateObjectId } = require('../middleware/validator');

// Public routes
router.post('/', validateMessage, createMessage);

// Protected routes - Admin only
router.get('/', protect, authorize('admin'), getMessages);
router.get('/stats/summary', protect, authorize('admin'), getMessageStats);
router.get('/:id', protect, authorize('admin'), validateObjectId('id'), getMessage);
router.put('/:id', protect, authorize('admin'), validateObjectId('id'), updateMessage);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteMessage);

// Bulk operations - Admin only
router.put('/bulk/read', protect, authorize('admin'), bulkMarkAsRead);
router.delete('/bulk/delete', protect, authorize('admin'), bulkDelete);

// Mark as read/unread - Admin only
router.put('/:id/read', protect, authorize('admin'), validateObjectId('id'), markAsRead);
router.put('/:id/unread', protect, authorize('admin'), validateObjectId('id'), markAsUnread);

module.exports = router;
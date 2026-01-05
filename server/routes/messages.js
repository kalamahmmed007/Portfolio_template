const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessageStats,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageValidation } = require('../middleware/validator');

router.get('/stats', protect, getMessageStats);

router.route('/')
  .get(protect, getMessages)
  .post(messageValidation, createMessage);

router.route('/:id')
  .get(protect, getMessage)
  .put(protect, updateMessage)
  .delete(protect, deleteMessage);

module.exports = router;
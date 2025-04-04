const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all messages for the authenticated user
router.get('/messages', chatController.getMessages);

// Send a new message
router.post('/messages', chatController.sendMessage);

// Process AI response to a message
router.post('/ai-response/:messageId', chatController.processAIResponse);

module.exports = router;
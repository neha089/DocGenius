const Message = require('../models/Message');
const User = require('../models/User');
const Document = require('../models/Document');

// Get all messages for a user
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name')
    .populate('document', 'originalName size');

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving messages'
    });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { content, receiverId, documentId } = req.body;

    // Validate receiver exists if provided
    if (receiverId) {
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: 'Receiver not found'
        });
      }
    }

    // Validate document exists if provided
    let document = null;
    if (documentId) {
      document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
    }

    // Create message
    const message = new Message({
      content,
      sender: req.user.id,
      receiver: receiverId || process.env.AI_USER_ID, // Default to AI if no receiver
      document: documentId
    });

    await message.save();

    // Populate sender and document info for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('document', 'originalName size');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// Process AI response to user message
exports.processAIResponse = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Find the original message
    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Generate AI response (this would normally connect to an AI service)
    // For this example, we'll create a simple response
    let responseContent = `I've processed your message: "${originalMessage.content}"`;
    
    if (originalMessage.document) {
      const document = await Document.findById(originalMessage.document);
      if (document) {
        responseContent += ` and the document "${document.originalName}".`;
      }
    }
    
    // Create AI response message
    const aiResponse = new Message({
      content: responseContent,
      sender: process.env.AI_USER_ID,
      receiver: originalMessage.sender,
      replyTo: messageId,
      document: null // AI can reference documents later if needed
    });
    
    await aiResponse.save();
    
    // Return the AI response
    res.status(201).json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing AI response'
    });
  }
};
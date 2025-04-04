const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { uploadMiddleware } = require('../middleware/upload');

// Get all documents for the authenticated user
router.get('/', documentController.getDocuments);

// Upload a new document
router.post('/', uploadMiddleware, documentController.uploadDocument);

// Get a single document
router.get('/:id', documentController.getDocument);

// Update document metadata
router.patch('/:id', documentController.updateDocument);

// Delete a document
router.delete('/:id', documentController.deleteDocument);

// Download a document
router.get('/:id/download', documentController.downloadDocument);

module.exports = router;
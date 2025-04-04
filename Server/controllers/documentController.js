const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Upload a new document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Create new document record
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.id,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      category: req.body.category || 'other'
    });

    await document.save();

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Document upload error:', error);
    // If there was an error, remove the uploaded file
    if (req.file) {
      try {
        await unlinkAsync(req.file.path);
      } catch (unlinkError) {
        console.error('Error removing file after failed upload:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
};

// Get all documents for a user
exports.getDocuments = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const category = req.query.category;
    const searchQuery = req.query.search;
    const isArchived = req.query.archived === 'true';
    
    // Build query
    const query = { 
      uploadedBy: req.user.id,
      isArchived
    };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }
    
    // Execute query with pagination
    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Get total count
    const total = await Document.countDocuments(query);
    
    res.json({
      success: true,
      count: documents.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving documents'
    });
  }
};

// Get a single document
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check ownership
    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving document'
    });
  }
};

// Update document metadata
exports.updateDocument = async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check ownership
    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this document'
      });
    }
    
    // Update fields
    const { tags, category, metadata, isArchived } = req.body;
    
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());
    if (category) document.category = category;
    if (isArchived !== undefined) document.isArchived = isArchived;
    
    // Handle metadata updates
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        document.metadata.set(key, value);
      }
    }
    
    await document.save();
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document'
    });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check ownership
    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }
    
    // Delete file from storage
    try {
      await unlinkAsync(document.path);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
      // Continue with document deletion even if file removal fails
    }
    
    // Delete document from database
    await document.remove();
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};

// Download a document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check ownership
    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this document'
      });
    }
    
    const filePath = path.resolve(document.path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    
    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading document'
    });
  }
};
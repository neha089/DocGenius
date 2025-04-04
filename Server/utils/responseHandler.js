/**
 * Utility to provide consistent API responses
 */

// Success response with data
exports.successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data
    });
  };
  
  // Success response with message
  exports.successMessageResponse = (res, message, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message
    });
  };
  
  // Error response
  exports.errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message
    });
  };
  
  // Not found response
  exports.notFoundResponse = (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message
    });
  };
  
  // Validation error response
  exports.validationErrorResponse = (res, errors) => {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  };
  
  // Unauthorized response
  exports.unauthorizedResponse = (res, message = 'Unauthorized access') => {
    return res.status(401).json({
      success: false,
      message
    });
  };
  
  // Forbidden response
  exports.forbiddenResponse = (res, message = 'Access forbidden') => {
    return res.status(403).json({
      success: false,
      message
    });
  };
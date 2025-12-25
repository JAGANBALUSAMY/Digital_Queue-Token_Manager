// Validation middleware for common request validations

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Validate organization code (6 characters)
const validateOrgCode = (code) => {
  return code && code.length === 6 && /^[A-Za-z0-9]+$/.test(code);
};

// Validate role
const validateRole = (role) => {
  const validRoles = ['customer', 'staff', 'manager', 'owner'];
  return validRoles.includes(role);
};

// Validate token status
const validateTokenStatus = (status) => {
  const validStatuses = ['waiting', 'serving', 'completed', 'cancelled'];
  return validStatuses.includes(status);
};

// Validate domain
const validateDomain = (domain) => {
  const validDomains = ['healthcare', 'government', 'food_service', 'education', 'banking', 'retail'];
  return validDomains.includes(domain);
};

module.exports = {
  validateEmail,
  validateRequiredFields,
  validateOrgCode,
  validateRole,
  validateTokenStatus,
  validateDomain
};
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Get user ID from token
const getUserIdFromToken = (token) => {
  try {
    const decoded = verifyToken(token);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getUserIdFromToken
};
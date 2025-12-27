const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user by ID (admin only)
router.get('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user (admin only)
router.put('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { full_name, phone, role } = req.body;
    
    // Validate role if provided
    if (role && !['customer', 'staff', 'manager', 'owner'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided'
      });
    }
    
    const user = await User.update(req.params.id, { full_name, phone, role });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
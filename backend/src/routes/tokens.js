const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const User = require('../models/User');
const Organization = require('../models/Organization');
const ServiceQueue = require('../models/ServiceQueue');
const { validateTokenStatus } = require('../middleware/validation');

// Get all tokens
router.get('/', async (req, res) => {
  try {
    // This endpoint might need pagination for performance
    const tokens = await Token.findAll();
    res.status(200).json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get token by ID
router.get('/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a new token
router.post('/', async (req, res) => {
  try {
    const { queue_id, user_id, organization_id, priority = false, is_walk_in = false } = req.body;
    
    // Validate required fields
    if (!queue_id || !organization_id) {
      return res.status(400).json({
        success: false,
        message: 'Queue ID and Organization ID are required'
      });
    }
    
    const token = await Token.create({
      queue_id,
      user_id: user_id || null, // user_id can be null for walk-in tokens
      organization_id,
      priority,
      is_walk_in
    });
    
    // Get related data for notifications
    const organization = await Organization.findById(organization_id);
    const serviceQueue = await ServiceQueue.findById(queue_id);
    
    // Emit token creation to socket
    req.app.get('io').emit('token_created', {
      token,
      queueId: queue_id,
      orgId: organization_id
    });
    
    // If user exists, send notification
    if (user_id) {
      const user = await User.findById(user_id);
      if (user) {
        // Schedule notifications using notification service
        const notificationService = req.app.get('notificationService');
        if (notificationService) {
          await notificationService.scheduleTokenNotifications(
            token, 
            user, 
            organization.name, 
            serviceQueue.name
          );
        }
      }
    }
    
    res.status(201).json({
      success: true,
      data: token,
      message: 'Token created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update token (mainly for status updates)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required for update'
      });
    }
    
    // Validate token status
    if (!validateTokenStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token status'
      });
    }
    
    const token = await Token.updateStatus(req.params.id, status);
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    // Emit token status update to socket
    const queue = await ServiceQueue.findById(token.queue_id);
    req.app.get('io').emit('update_token_status', {
      tokenId: token.id,
      status: token.status,
      queueId: token.queue_id,
      orgId: token.organization_id
    });
    
    res.status(200).json({
      success: true,
      data: token,
      message: `Token status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete token
router.delete('/:id', async (req, res) => {
  try {
    // In a real system, you might want to prevent deletion of tokens that are already served
    const token = await Token.findById(req.params.id);
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    // Perform soft delete by updating status to cancelled
    const updatedToken = await Token.updateStatus(req.params.id, 'cancelled');
    
    res.status(200).json({
      success: true,
      data: updatedToken,
      message: 'Token cancelled successfully'
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
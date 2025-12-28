const express = require('express');
const router = express.Router();
const ServiceQueue = require('../models/ServiceQueue');
const Organization = require('../models/Organization');

// Get all queues
router.get('/', async (req, res) => {
  try {
    const queues = await ServiceQueue.findAllWithOrg();
    res.status(200).json({
      success: true,
      data: queues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get queue by ID
router.get('/:id', async (req, res) => {
  try {
    const queue = await ServiceQueue.findById(req.params.id);
    
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: queue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a new queue
router.post('/', async (req, res) => {
  try {
    const { organization_id, name, description, max_tokens_per_day, avg_service_time, is_priority_enabled } = req.body;
    
    // Validate required fields
    if (!organization_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID and name are required'
      });
    }
    
    // Validate organization exists
    const organization = await Organization.findById(organization_id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    
    // Create the queue
    const queue = await ServiceQueue.create({
      organization_id,
      name,
      description,
      max_tokens_per_day: max_tokens_per_day || 100,
      avg_service_time: avg_service_time || 10,
      is_priority_enabled: is_priority_enabled || false
    });
    
    res.status(201).json({
      success: true,
      data: queue,
      message: 'Queue created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update queue
router.put('/:id', async (req, res) => {
  try {
    const { name, description, max_tokens_per_day, avg_service_time, is_priority_enabled, is_active } = req.body;
    
    const queue = await ServiceQueue.update(req.params.id, {
      name,
      description,
      max_tokens_per_day,
      avg_service_time,
      is_priority_enabled,
      is_active
    });
    
    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: queue,
      message: 'Queue updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete queue
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ServiceQueue.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Queue not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Queue deleted successfully'
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
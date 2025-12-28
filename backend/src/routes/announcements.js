const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { auth, authorize } = require('../middleware/auth');

// Get all announcements (admin only)
router.get('/', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get announcements for an organization (public endpoint)
router.get('/organization/:orgId', async (req, res) => {
  try {
    const announcements = await Announcement.findByOrganizationId(req.params.orgId);
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get announcements for a specific queue
router.get('/queue/:queueId', async (req, res) => {
  try {
    const announcements = await Announcement.findByQueueId(req.params.queueId);
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get announcements by user (creator)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user is trying to access their own announcements or is an admin
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'manager' && req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these announcements'
      });
    }

    const announcements = await Announcement.findByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a new announcement (manager/owner only)
router.post('/', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { organization_id, queue_id, title, message, priority, start_date, end_date } = req.body;

    // Validate required fields
    if (!organization_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID, title, and message are required'
      });
    }

    // Validate priority if provided
    const validPriorities = ['normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be normal, high, or urgent'
      });
    }

    const announcement = await Announcement.create({
      organization_id,
      queue_id: queue_id || null,
      title,
      message,
      priority: priority || 'normal',
      created_by: req.user.id,
      start_date: start_date || null,
      end_date: end_date || null
    });

    // Emit announcement to socket for real-time updates
    req.app.get('io').emit('new_announcement', {
      announcement,
      orgId: organization_id,
      queueId: queue_id
    });

    res.status(201).json({
      success: true,
      data: announcement,
      message: 'Announcement created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update announcement (manager/owner only)
router.put('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { title, message, priority, is_active, start_date, end_date } = req.body;

    // Validate priority if provided
    const validPriorities = ['normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be normal, high, or urgent'
      });
    }

    const announcement = await Announcement.update(req.params.id, {
      title,
      message,
      priority,
      is_active,
      start_date,
      end_date
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Emit announcement update to socket
    req.app.get('io').emit('update_announcement', {
      announcement,
      orgId: announcement.organization_id,
      queueId: announcement.queue_id
    });

    res.status(200).json({
      success: true,
      data: announcement,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete announcement (manager/owner only)
router.delete('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const deleted = await Announcement.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Emit announcement deletion to socket
    req.app.get('io').emit('delete_announcement', {
      id: req.params.id
    });

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
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
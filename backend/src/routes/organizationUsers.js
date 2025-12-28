const express = require('express');
const router = express.Router();
const OrganizationUser = require('../models/OrganizationUser');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { auth, authorize } = require('../middleware/auth');

// Get all organizations for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user is trying to access their own organizations or is an admin
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'manager' && req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these organizations'
      });
    }

    const organizations = await OrganizationUser.findByUser(req.params.userId);
    res.status(200).json({
      success: true,
      data: organizations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all users for an organization
router.get('/organization/:orgId', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const users = await OrganizationUser.findByOrganization(req.params.orgId);
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

// Add user to organization
router.post('/', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { user_id, organization_id, role } = req.body;

    // Validate required fields
    if (!user_id || !organization_id || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID, organization ID, and role are required'
      });
    }

    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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

    // Validate role
    const validRoles = ['staff', 'manager', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be staff, manager, or owner'
      });
    }

    // Check if user already has access to this organization
    const existingAccess = await OrganizationUser.findByUserAndOrg(user_id, organization_id);
    if (existingAccess && existingAccess.is_active) {
      return res.status(400).json({
        success: false,
        message: 'User already has access to this organization'
      });
    }

    // Add user to organization
    const orgUser = await OrganizationUser.addUserToOrganization(user_id, organization_id, role);

    res.status(201).json({
      success: true,
      data: orgUser,
      message: 'User added to organization successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user role in organization
router.put('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { role, is_active } = req.body;

    // Validate role if provided
    const validRoles = ['staff', 'manager', 'owner'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be staff, manager, or owner'
      });
    }

    const orgUser = await OrganizationUser.update(req.params.id, {
      role: role || undefined,
      is_active: is_active !== undefined ? is_active : undefined
    });

    if (!orgUser) {
      return res.status(404).json({
        success: false,
        message: 'Organization-user association not found'
      });
    }

    res.status(200).json({
      success: true,
      data: orgUser,
      message: 'Organization-user association updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Remove user from organization (deactivate association)
router.delete('/:id', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const orgUser = await OrganizationUser.remove(req.params.id);

    if (!orgUser) {
      return res.status(404).json({
        success: false,
        message: 'Organization-user association not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User removed from organization successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Check if user has access to organization
router.get('/check-access/:userId/:orgId', auth, async (req, res) => {
  try {
    const hasAccess = await OrganizationUser.checkUserAccess(req.params.userId, req.params.orgId);
    
    res.status(200).json({
      success: true,
      hasAccess: hasAccess
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
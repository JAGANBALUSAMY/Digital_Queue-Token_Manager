const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const { validateRequiredFields, validateDomain } = require('../middleware/validation');

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.findAll();
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

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a new organization
router.post('/', validateRequiredFields(['name', 'code', 'domain']), async (req, res) => {
  try {
    const { name, code, domain, description, address, city, state, country, pincode, latitude, longitude } = req.body;
    
    // Validate domain
    if (!validateDomain(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain',
        error: 'Domain must be one of: healthcare, government, food_service, education, banking, retail'
      });
    }
    
    // Check if organization with this code already exists
    const existingOrg = await Organization.findByCode(code);
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this code already exists'
      });
    }
    
    const organization = await Organization.create({
      name,
      code,
      domain,
      description,
      address,
      city,
      state,
      country,
      pincode,
      latitude,
      longitude
    });
    
    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const { name, domain, description, address, city, state, country, pincode, latitude, longitude } = req.body;
    
    // Validate domain if provided
    if (domain && !validateDomain(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid domain',
        error: 'Domain must be one of: healthcare, government, food_service, education, banking, retail'
      });
    }
    
    const organization = await Organization.update(req.params.id, {
      name,
      domain,
      description,
      address,
      city,
      state,
      country,
      pincode,
      latitude,
      longitude
    });
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Organization.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Verify an organization (admin only)
router.put('/:id/verify', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const organization = await Organization.verify(req.params.id);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: organization,
      message: 'Organization verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get unverified organizations (admin only)
router.get('/unverified', auth, authorize('manager', 'owner'), async (req, res) => {
  try {
    const organizations = await Organization.getUnverified();
    
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

module.exports = router;
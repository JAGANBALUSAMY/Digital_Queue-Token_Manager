const db = require('../config/database');

class Organization {
  constructor(organizationData) {
    this.id = organizationData.id;
    this.name = organizationData.name;
    this.code = organizationData.code;
    this.domain = organizationData.domain;
    this.description = organizationData.description;
    this.address = organizationData.address;
    this.city = organizationData.city;
    this.state = organizationData.state;
    this.country = organizationData.country;
    this.pincode = organizationData.pincode;
    this.latitude = organizationData.latitude;
    this.longitude = organizationData.longitude;
    this.is_verified = organizationData.is_verified || false;
    this.created_at = organizationData.created_at;
    this.updated_at = organizationData.updated_at;
  }

  // Create a new organization
  static async create(organizationData) {
    const {
      name, code, domain, description, address, city, state, country, pincode, latitude, longitude
    } = organizationData;
    
    const query = `
      INSERT INTO organizations (name, code, domain, description, address, city, state, country, pincode, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [name, code, domain, description, address, city, state, country, pincode, latitude, longitude];
    
    try {
      const result = await db.query(query, values);
      return new Organization(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find organization by ID
  static async findById(id) {
    const query = 'SELECT * FROM organizations WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Organization(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find organization by code
  static async findByCode(code) {
    const query = 'SELECT * FROM organizations WHERE code = $1';
    
    try {
      const result = await db.query(query, [code]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Organization(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find all organizations
  static async findAll() {
    const query = 'SELECT * FROM organizations ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => new Organization(row));
    } catch (error) {
      throw error;
    }
  }

  // Update organization
  static async update(id, updateData) {
    const {
      name, domain, description, address, city, state, country, pincode, latitude, longitude
    } = updateData;
    
    const query = `
      UPDATE organizations 
      SET name = $1, domain = $2, description = $3, address = $4, city = $5, 
          state = $6, country = $7, pincode = $8, latitude = $9, longitude = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `;
    
    const values = [name, domain, description, address, city, state, country, pincode, latitude, longitude, id];
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return new Organization(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Delete organization
  static async delete(id) {
    const query = 'DELETE FROM organizations WHERE id = $1 RETURNING id';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Search organizations by name, domain, or location
  static async search(searchTerm) {
    const query = `
      SELECT * FROM organizations 
      WHERE (name ILIKE $1 OR code ILIKE $1) 
      AND is_verified = true
      ORDER BY created_at DESC
    `;
    
    const searchTermFormatted = `%${searchTerm}%`;
    
    try {
      const result = await db.query(query, [searchTermFormatted]);
      return result.rows.map(row => new Organization(row));
    } catch (error) {
      throw error;
    }
  }
  
  // Verify an organization (admin only)
  static async verify(id) {
    const query = `
      UPDATE organizations 
      SET is_verified = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Organization(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }
  
  // Get unverified organizations
  static async getUnverified() {
    const query = 'SELECT * FROM organizations WHERE is_verified = false ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => new Organization(row));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Organization;
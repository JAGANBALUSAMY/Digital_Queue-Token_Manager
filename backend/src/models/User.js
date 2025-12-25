const db = require('../config/database');
const { hash } = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.full_name = userData.full_name;
    this.phone = userData.phone;
    this.role = userData.role || 'customer';
    this.is_verified = userData.is_verified || false;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { email, password_hash, full_name, phone, role } = userData;
    
    const query = `
      INSERT INTO users (email, password_hash, full_name, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [email, password_hash, full_name, phone, role];
    
    try {
      const result = await db.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, email, full_name, phone, role, is_verified, created_at, updated_at FROM users WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, updateData) {
    const { full_name, phone, role } = updateData;
    
    const query = `
      UPDATE users 
      SET full_name = $1, phone = $2, role = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, full_name, phone, role, updated_at
    `;
    
    const values = [full_name, phone, role, id];
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    const query = 'SELECT id, email, full_name, phone, role, is_verified, created_at, updated_at FROM users ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => new User(row));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
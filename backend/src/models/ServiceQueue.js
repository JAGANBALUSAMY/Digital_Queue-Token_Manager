const db = require('../config/database');

class ServiceQueue {
  constructor(queueData) {
    this.id = queueData.id;
    this.organization_id = queueData.organization_id;
    this.name = queueData.name;
    this.description = queueData.description;
    this.max_tokens_per_day = queueData.max_tokens_per_day || 100;
    this.avg_service_time = queueData.avg_service_time || 10; // in minutes
    this.is_active = queueData.is_active || true;
    this.is_priority_enabled = queueData.is_priority_enabled || false;
    this.created_at = queueData.created_at;
    this.updated_at = queueData.updated_at;
  }

  // Create a new service queue
  static async create(queueData) {
    const {
      organization_id, name, description, max_tokens_per_day, avg_service_time, is_priority_enabled
    } = queueData;
    
    const query = `
      INSERT INTO service_queues (organization_id, name, description, max_tokens_per_day, avg_service_time, is_priority_enabled)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [organization_id, name, description, max_tokens_per_day, avg_service_time, is_priority_enabled];
    
    try {
      const result = await db.query(query, values);
      return new ServiceQueue(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find queue by ID
  static async findById(id) {
    const query = 'SELECT * FROM service_queues WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new ServiceQueue(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find all queues for an organization
  static async findByOrganizationId(orgId) {
    const query = 'SELECT * FROM service_queues WHERE organization_id = $1 ORDER BY name';
    
    try {
      const result = await db.query(query, [orgId]);
      return result.rows.map(row => new ServiceQueue(row));
    } catch (error) {
      throw error;
    }
  }

  // Find all active queues for an organization
  static async findActiveByOrganizationId(orgId) {
    const query = 'SELECT * FROM service_queues WHERE organization_id = $1 AND is_active = true ORDER BY name';
    
    try {
      const result = await db.query(query, [orgId]);
      return result.rows.map(row => new ServiceQueue(row));
    } catch (error) {
      throw error;
    }
  }

  // Update queue
  static async update(id, updateData) {
    const {
      name, description, max_tokens_per_day, avg_service_time, is_priority_enabled, is_active
    } = updateData;
    
    const query = `
      UPDATE service_queues 
      SET name = $1, description = $2, max_tokens_per_day = $3, 
          avg_service_time = $4, is_priority_enabled = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [name, description, max_tokens_per_day, avg_service_time, is_priority_enabled, is_active, id];
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return new ServiceQueue(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Delete queue
  static async delete(id) {
    const query = 'DELETE FROM service_queues WHERE id = $1 RETURNING id';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get queue statistics
  static async getQueueStats(queueId) {
    const query = `
      SELECT 
        sq.name as queue_name,
        o.name as organization_name,
        COUNT(CASE WHEN t.status = 'waiting' THEN 1 END) as waiting_tokens,
        COUNT(CASE WHEN t.status = 'serving' THEN 1 END) as serving_tokens,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tokens_today,
        COUNT(CASE WHEN t.status = 'cancelled' THEN 1 END) as cancelled_tokens_today
      FROM service_queues sq
      JOIN organizations o ON sq.organization_id = o.id
      LEFT JOIN tokens t ON sq.id = t.queue_id 
        AND t.created_at::date = CURRENT_DATE
      WHERE sq.id = $1
      GROUP BY sq.id, o.id
    `;
    
    try {
      const result = await db.query(query, [queueId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get all queues with organization information
  static async findAllWithOrg() {
    const query = `
      SELECT sq.*, o.name as organization_name
      FROM service_queues sq
      JOIN organizations o ON sq.organization_id = o.id
      ORDER BY o.name, sq.name
    `;
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => {
        const queue = new ServiceQueue(row);
        queue.organization_name = row.organization_name;
        return queue;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ServiceQueue;
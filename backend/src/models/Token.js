const db = require('../config/database');
const { generateTokenNumber, getNextTokenPosition } = require('../utils/databaseHelper');

class Token {
  constructor(tokenData) {
    this.id = tokenData.id;
    this.token_number = tokenData.token_number;
    this.queue_id = tokenData.queue_id;
    this.user_id = tokenData.user_id;
    this.organization_id = tokenData.organization_id;
    this.status = tokenData.status || 'waiting';
    this.priority = tokenData.priority || false;
    this.created_at = tokenData.created_at;
    this.served_at = tokenData.served_at;
    this.completed_at = tokenData.completed_at;
    this.estimated_wait_time = tokenData.estimated_wait_time;
    this.called_at = tokenData.called_at;
    this.token_position = tokenData.token_position;
    this.is_walk_in = tokenData.is_walk_in || false;
  }

  // Create a new token
  static async create(tokenData) {
    const { queue_id, user_id, organization_id, priority, is_walk_in } = tokenData;
    
    // Generate unique token number
    const token_number = await generateTokenNumber(queue_id);
    
    // Get the next position in the queue
    const token_position = await getNextTokenPosition(queue_id);
    
    // Calculate estimated wait time based on position and average service time
    // This is a simplified calculation - in a real system, you'd need to consider
    // current queue status and service times
    const estimated_wait_time = token_position * 10; // Assuming 10 mins per token as default
    
    const query = `
      INSERT INTO tokens (token_number, queue_id, user_id, organization_id, priority, estimated_wait_time, token_position, is_walk_in)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [token_number, queue_id, user_id, organization_id, priority, estimated_wait_time, token_position, is_walk_in];
    
    try {
      const result = await db.query(query, values);
      return new Token(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find token by ID
  static async findById(id) {
    const query = 'SELECT * FROM tokens WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Token(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find token by token number
  static async findByTokenNumber(tokenNumber) {
    const query = 'SELECT * FROM tokens WHERE token_number = $1';
    
    try {
      const result = await db.query(query, [tokenNumber]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Token(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Get all tokens for a specific queue
  static async findByQueueId(queueId, status = null) {
    let query = 'SELECT * FROM tokens WHERE queue_id = $1';
    const params = [queueId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    } else {
      query += ' ORDER BY token_position ASC';
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows.map(row => new Token(row));
    } catch (error) {
      throw error;
    }
  }

  // Get all tokens for a specific user
  static async findByUserId(userId, status = null) {
    let query = 'SELECT * FROM tokens WHERE user_id = $1';
    const params = [userId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows.map(row => new Token(row));
    } catch (error) {
      throw error;
    }
  }

  // Update token status
  static async updateStatus(tokenId, status) {
    const validStatuses = ['waiting', 'serving', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    let updateField = '';
    if (status === 'serving') {
      updateField = 'called_at = CURRENT_TIMESTAMP';
    } else if (status === 'completed') {
      updateField = 'served_at = CURRENT_TIMESTAMP, completed_at = CURRENT_TIMESTAMP';
    } else if (status === 'cancelled') {
      updateField = 'completed_at = CURRENT_TIMESTAMP';
    }
    
    const query = `
      UPDATE tokens 
      SET status = $1, ${updateField}
      WHERE id = $2
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [status, tokenId]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Token(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Get all tokens
  static async findAll() {
    const query = 'SELECT * FROM tokens ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => new Token(row));
    } catch (error) {
      throw error;
    }
  }

  // Get active tokens for an organization
  static async getActiveTokensForOrg(orgId) {
    const query = `
      SELECT t.*, sq.name as queue_name, o.name as organization_name
      FROM tokens t
      JOIN service_queues sq ON t.queue_id = sq.id
      JOIN organizations o ON t.organization_id = o.id
      WHERE t.organization_id = $1
      AND t.status IN ('waiting', 'serving')
      ORDER BY t.token_position ASC
    `;
    
    try {
      const result = await db.query(query, [orgId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get token history for an organization
  static async getTokenHistoryForOrg(orgId, limit = 50, offset = 0) {
    const query = `
      SELECT t.*, sq.name as queue_name, u.full_name as user_name
      FROM tokens t
      JOIN service_queues sq ON t.queue_id = sq.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.organization_id = $1
      AND t.status IN ('completed', 'cancelled')
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await db.query(query, [orgId, limit, offset]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Token;
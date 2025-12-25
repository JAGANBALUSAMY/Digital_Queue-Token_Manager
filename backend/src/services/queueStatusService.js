// Service for managing real-time queue status
const db = require('../config/database');

class QueueStatusService {
  constructor(io) {
    this.io = io;
    this.queueStatus = new Map(); // In-memory storage for queue status
    this.setupIntervals();
  }

  // Set up periodic updates
  setupIntervals() {
    // Update queue status every 30 seconds
    setInterval(() => {
      this.updateAllQueueStatuses();
    }, 30000); // 30 seconds
  }

  // Update status for all queues
  async updateAllQueueStatuses() {
    try {
      // Test database connection first
      await db.query('SELECT 1');
      
      // Get all active queues from database
      const query = `
        SELECT 
          sq.id as queue_id,
          sq.name as queue_name,
          o.id as org_id,
          o.name as org_name,
          COUNT(CASE WHEN t.status = 'waiting' THEN 1 END) as waiting_count,
          COUNT(CASE WHEN t.status = 'serving' THEN 1 END) as serving_count,
          COALESCE(MIN(CASE WHEN t.status = 'waiting' THEN t.token_position END), 0) as next_position,
          (SELECT token_number FROM tokens WHERE queue_id = sq.id AND status = 'serving' ORDER BY called_at DESC LIMIT 1) as current_serving_token
        FROM service_queues sq
        JOIN organizations o ON sq.organization_id = o.id
        LEFT JOIN tokens t ON sq.id = t.queue_id AND t.status IN ('waiting', 'serving')
        WHERE sq.is_active = true
        GROUP BY sq.id, o.id
      `;

      const result = await db.query(query);
      
      // Update in-memory status
      for (const row of result.rows) {
        this.queueStatus.set(row.queue_id, {
          queueId: row.queue_id,
          queueName: row.queue_name,
          orgId: row.org_id,
          orgName: row.org_name,
          waitingCount: parseInt(row.waiting_count),
          servingCount: parseInt(row.serving_count),
          nextPosition: parseInt(row.next_position),
          currentServingToken: row.current_serving_token,
          lastUpdated: new Date()
        });
      }

      // Emit updates to relevant rooms
      for (const [queueId, status] of this.queueStatus) {
        this.io.to(`queue_${queueId}`).emit('queue_status_update', status);
        this.io.to(`org_${status.orgId}`).emit('queue_status_update', status);
      }
    } catch (error) {
      if (error.code === '28P01') { // Authentication error
        console.warn('Database authentication failed (optional for development). Skipping queue status updates.');
      } else if (error.code === '42P01') { // Undefined table error
        console.warn('Database tables not created yet (optional for development). Skipping queue status updates.');
      } else {
        console.warn('Database not available (optional for development). Skipping queue status updates:', error.message);
      }
    }
  }

  // Get status for a specific queue
  getQueueStatus(queueId) {
    return this.queueStatus.get(queueId) || null;
  }

  // Update status for a specific queue
  async updateQueueStatus(queueId) {
    try {
      // Test database connection first
      await db.query('SELECT 1');
      
      const query = `
        SELECT 
          sq.id as queue_id,
          sq.name as queue_name,
          o.id as org_id,
          o.name as org_name,
          COUNT(CASE WHEN t.status = 'waiting' THEN 1 END) as waiting_count,
          COUNT(CASE WHEN t.status = 'serving' THEN 1 END) as serving_count,
          COALESCE(MIN(CASE WHEN t.status = 'waiting' THEN t.token_position END), 0) as next_position,
          (SELECT token_number FROM tokens WHERE queue_id = sq.id AND status = 'serving' ORDER BY called_at DESC LIMIT 1) as current_serving_token
        FROM service_queues sq
        JOIN organizations o ON sq.organization_id = o.id
        LEFT JOIN tokens t ON sq.id = t.queue_id AND t.status IN ('waiting', 'serving')
        WHERE sq.id = $1
        GROUP BY sq.id, o.id
      `;

      const result = await db.query(query, [queueId]);
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        const status = {
          queueId: row.queue_id,
          queueName: row.queue_name,
          orgId: row.org_id,
          orgName: row.org_name,
          waitingCount: parseInt(row.waiting_count),
          servingCount: parseInt(row.serving_count),
          nextPosition: parseInt(row.next_position),
          currentServingToken: row.current_serving_token,
          lastUpdated: new Date()
        };

        this.queueStatus.set(queueId, status);
        
        // Emit to relevant rooms
        this.io.to(`queue_${queueId}`).emit('queue_status_update', status);
        this.io.to(`org_${status.orgId}`).emit('queue_status_update', status);
        
        return status;
      }
      
      return null;
    } catch (error) {
      if (error.code === '28P01') { // Authentication error
        console.warn('Database authentication failed (optional for development). Skipping queue status update for queue:', queueId);
      } else if (error.code === '42P01') { // Undefined table error
        console.warn('Database tables not created yet (optional for development). Skipping queue status update for queue:', queueId);
      } else {
        console.warn('Database not available (optional for development). Skipping queue status update for queue:', queueId, error.message);
      }
      return null;
    }
  }

  // Get all queue statuses
  getAllQueueStatuses() {
    return Array.from(this.queueStatus.values());
  }

  // Calculate estimated wait time for a token
  async calculateEstimatedWaitTime(queueId, tokenPosition) {
    try {
      // Test database connection first
      await db.query('SELECT 1');
      
      // Get the queue's average service time
      const queueQuery = 'SELECT avg_service_time FROM service_queues WHERE id = $1';
      const queueResult = await db.query(queueQuery, [queueId]);
      
      if (queueResult.rows.length === 0) {
        return null;
      }
      
      const avgServiceTime = queueResult.rows[0].avg_service_time;
      
      // Get the number of tokens ahead in the queue
      const aheadQuery = `
        SELECT COUNT(*) as count 
        FROM tokens 
        WHERE queue_id = $1 
        AND token_position < $2 
        AND status = 'waiting'
      `;
      const aheadResult = await db.query(aheadQuery, [queueId, tokenPosition]);
      const tokensAhead = parseInt(aheadResult.rows[0].count);
      
      // Calculate estimated wait time
      const estimatedWaitTime = tokensAhead * avgServiceTime;
      
      return {
        tokensAhead,
        estimatedWaitTime, // in minutes
        estimatedFinishTime: new Date(Date.now() + (estimatedWaitTime * 60 * 1000))
      };
    } catch (error) {
      if (error.code === '28P01') { // Authentication error
        console.warn('Database authentication failed (optional for development). Cannot calculate estimated wait time.');
      } else if (error.code === '42P01') { // Undefined table error
        console.warn('Database tables not created yet (optional for development). Cannot calculate estimated wait time.');
      } else {
        console.warn('Database not available (optional for development). Cannot calculate estimated wait time:', error.message);
      }
      return null;
    }
  }
}

module.exports = QueueStatusService;
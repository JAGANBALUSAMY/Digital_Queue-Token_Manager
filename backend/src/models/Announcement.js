const db = require('../config/database');

class Announcement {
  constructor(announcementData) {
    this.id = announcementData.id;
    this.organization_id = announcementData.organization_id;
    this.queue_id = announcementData.queue_id || null; // null means organization-wide announcement
    this.title = announcementData.title;
    this.message = announcementData.message;
    this.priority = announcementData.priority || 'normal'; // normal, high, urgent
    this.created_by = announcementData.created_by;
    this.is_active = announcementData.is_active || true;
    this.start_date = announcementData.start_date;
    this.end_date = announcementData.end_date;
    this.created_at = announcementData.created_at;
    this.updated_at = announcementData.updated_at;
  }

  // Create a new announcement
  static async create(announcementData) {
    const {
      organization_id, queue_id, title, message, priority, created_by, start_date, end_date
    } = announcementData;

    const query = `
      INSERT INTO announcements (organization_id, queue_id, title, message, priority, created_by, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [organization_id, queue_id, title, message, priority, created_by, start_date, end_date];

    try {
      const result = await db.query(query, values);
      return new Announcement(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find announcement by ID
  static async findById(id) {
    const query = 'SELECT * FROM announcements WHERE id = $1';

    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Announcement(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find all active announcements for an organization
  static async findByOrganizationId(orgId) {
    const query = `
      SELECT a.*, u.full_name as created_by_name
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      WHERE a.organization_id = $1 
        AND a.is_active = true
        AND (a.start_date <= CURRENT_TIMESTAMP OR a.start_date IS NULL)
        AND (a.end_date >= CURRENT_TIMESTAMP OR a.end_date IS NULL)
      ORDER BY a.priority DESC, a.created_at DESC
    `;

    try {
      const result = await db.query(query, [orgId]);
      return result.rows.map(row => {
        const announcement = new Announcement(row);
        announcement.created_by_name = row.created_by_name;
        return announcement;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find all active announcements for a specific queue
  static async findByQueueId(queueId) {
    const query = `
      SELECT a.*, u.full_name as created_by_name
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      WHERE (a.queue_id = $1 OR a.queue_id IS NULL)
        AND a.is_active = true
        AND (a.start_date <= CURRENT_TIMESTAMP OR a.start_date IS NULL)
        AND (a.end_date >= CURRENT_TIMESTAMP OR a.end_date IS NULL)
      ORDER BY a.priority DESC, a.created_at DESC
    `;

    try {
      const result = await db.query(query, [queueId]);
      return result.rows.map(row => {
        const announcement = new Announcement(row);
        announcement.created_by_name = row.created_by_name;
        return announcement;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find all announcements by user (creator)
  static async findByUserId(userId) {
    const query = `
      SELECT a.*, o.name as organization_name, sq.name as queue_name
      FROM announcements a
      LEFT JOIN organizations o ON a.organization_id = o.id
      LEFT JOIN service_queues sq ON a.queue_id = sq.id
      WHERE a.created_by = $1
      ORDER BY a.created_at DESC
    `;

    try {
      const result = await db.query(query, [userId]);
      return result.rows.map(row => {
        const announcement = new Announcement(row);
        announcement.organization_name = row.organization_name;
        announcement.queue_name = row.queue_name;
        return announcement;
      });
    } catch (error) {
      throw error;
    }
  }

  // Update announcement
  static async update(id, updateData) {
    const {
      title, message, priority, is_active, start_date, end_date
    } = updateData;

    const query = `
      UPDATE announcements 
      SET title = $1, message = $2, priority = $3, is_active = $4, 
          start_date = $5, end_date = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;

    const values = [title, message, priority, is_active, start_date, end_date, id];

    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return new Announcement(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Delete announcement
  static async delete(id) {
    const query = 'DELETE FROM announcements WHERE id = $1 RETURNING id';

    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all announcements with organization and queue names
  static async findAll() {
    const query = `
      SELECT a.*, u.full_name as created_by_name, o.name as organization_name, sq.name as queue_name
      FROM announcements a
      JOIN users u ON a.created_by = u.id
      JOIN organizations o ON a.organization_id = o.id
      LEFT JOIN service_queues sq ON a.queue_id = sq.id
      ORDER BY a.created_at DESC
    `;

    try {
      const result = await db.query(query);
      return result.rows.map(row => {
        const announcement = new Announcement(row);
        announcement.created_by_name = row.created_by_name;
        announcement.organization_name = row.organization_name;
        announcement.queue_name = row.queue_name;
        return announcement;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Announcement;
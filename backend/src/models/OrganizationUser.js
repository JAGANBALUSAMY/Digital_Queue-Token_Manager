const db = require('../config/database');

class OrganizationUser {
  constructor(organizationUserData) {
    this.id = organizationUserData.id;
    this.user_id = organizationUserData.user_id;
    this.organization_id = organizationUserData.organization_id;
    this.role = organizationUserData.role;
    this.is_active = organizationUserData.is_active;
    this.created_at = organizationUserData.created_at;
    this.updated_at = organizationUserData.updated_at;
  }

  // Create a new organization-user association
  static async create(organizationUserData) {
    const {
      user_id, organization_id, role
    } = organizationUserData;

    const query = `
      INSERT INTO organization_users (user_id, organization_id, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [user_id, organization_id, role];

    try {
      const result = await db.query(query, values);
      return new OrganizationUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find organization-user association by ID
  static async findById(id) {
    const query = 'SELECT * FROM organization_users WHERE id = $1';

    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new OrganizationUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find organization-user association by user and organization
  static async findByUserAndOrg(user_id, organization_id) {
    const query = 'SELECT * FROM organization_users WHERE user_id = $1 AND organization_id = $2';

    try {
      const result = await db.query(query, [user_id, organization_id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new OrganizationUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find all organizations for a user
  static async findByUser(user_id) {
    const query = `
      SELECT ou.*, o.name as organization_name, o.code as organization_code
      FROM organization_users ou
      JOIN organizations o ON ou.organization_id = o.id
      WHERE ou.user_id = $1 AND ou.is_active = true
      ORDER BY o.name
    `;

    try {
      const result = await db.query(query, [user_id]);
      return result.rows.map(row => {
        const orgUser = new OrganizationUser(row);
        orgUser.organization_name = row.organization_name;
        orgUser.organization_code = row.organization_code;
        return orgUser;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find all users for an organization
  static async findByOrganization(organization_id) {
    const query = `
      SELECT ou.*, u.full_name, u.email
      FROM organization_users ou
      JOIN users u ON ou.user_id = u.id
      WHERE ou.organization_id = $1 AND ou.is_active = true
      ORDER BY u.full_name
    `;

    try {
      const result = await db.query(query, [organization_id]);
      return result.rows.map(row => {
        const orgUser = new OrganizationUser(row);
        orgUser.full_name = row.full_name;
        orgUser.email = row.email;
        return orgUser;
      });
    } catch (error) {
      throw error;
    }
  }

  // Update organization-user association
  static async update(id, updateData) {
    const {
      role, is_active
    } = updateData;

    const query = `
      UPDATE organization_users 
      SET role = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const values = [role, is_active, id];

    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return new OrganizationUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Remove (deactivate) organization-user association
  static async remove(id) {
    const query = `
      UPDATE organization_users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new OrganizationUser(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Delete organization-user association permanently
  static async delete(id) {
    const query = 'DELETE FROM organization_users WHERE id = $1 RETURNING id';

    try {
      const result = await db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Add user to organization
  static async addUserToOrganization(user_id, organization_id, role) {
    // Check if user is already associated with this organization
    const existing = await OrganizationUser.findByUserAndOrg(user_id, organization_id);
    if (existing) {
      // Update the existing record
      return await OrganizationUser.update(existing.id, {
        role: role,
        is_active: true
      });
    }

    // Create new association
    return await OrganizationUser.create({
      user_id,
      organization_id,
      role
    });
  }

  // Check if user has access to organization
  static async checkUserAccess(user_id, organization_id) {
    const query = `
      SELECT * FROM organization_users 
      WHERE user_id = $1 AND organization_id = $2 AND is_active = true
    `;

    try {
      const result = await db.query(query, [user_id, organization_id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrganizationUser;
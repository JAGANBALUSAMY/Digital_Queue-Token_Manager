const { Pool } = require('pg');
require('dotenv').config();

// Database configuration - connect to default postgres database first
const defaultDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
};

const targetDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'qease_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
};

async function setupDatabase() {
  let defaultPool = new Pool(defaultDbConfig);
  
  try {
    console.log('Checking if database exists...');
    
    // Check if the target database exists
    const dbExistsResult = await defaultPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1", 
      [targetDbConfig.database]
    );
    
    if (dbExistsResult.rows.length === 0) {
      console.log(`Database ${targetDbConfig.database} does not exist. Creating it...`);
      
      // Create the database
      await defaultPool.query(`CREATE DATABASE "${targetDbConfig.database}"`);
      console.log(`✅ Database ${targetDbConfig.database} created successfully!`);
    } else {
      console.log(`✅ Database ${targetDbConfig.database} already exists.`);
    }
    
    // Close the default pool connection
    await defaultPool.end();
    
    // Now connect to the target database
    const targetPool = new Pool(targetDbConfig);
    
    console.log('Checking if tables exist...');
    
    // Check if tables exist by querying information_schema
    const tablesResult = await targetPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    // Define all the tables we need
    const requiredTables = [
      'users',
      'organizations', 
      'organization_users',
      'service_queues',
      'tokens',
      'queue_status',
      'notifications',
      'feedback',
      'audit_logs'
    ];
    
    // Check if all required tables exist
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log(`Creating missing tables: ${missingTables.join(', ')}`);
      
      // Create tables
      if (!existingTables.includes('users')) {
        await targetPool.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            role VARCHAR(50) NOT NULL DEFAULT 'customer', -- customer, staff, manager, owner
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created users table');
      }

      if (!existingTables.includes('organizations')) {
        await targetPool.query(`
          CREATE TABLE organizations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(6) UNIQUE NOT NULL, -- 6-digit unique organization code
            domain VARCHAR(100) NOT NULL, -- healthcare, government, food_service, education, banking, retail
            description TEXT,
            address TEXT,
            city VARCHAR(100),
            state VARCHAR(100),
            country VARCHAR(100),
            pincode VARCHAR(10),
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created organizations table');
      }

      if (!existingTables.includes('organization_users')) {
        await targetPool.query(`
          CREATE TABLE organization_users (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL, -- staff, manager, owner
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, organization_id)
          );
        `);
        console.log('✅ Created organization_users table');
      }

      if (!existingTables.includes('service_queues')) {
        await targetPool.query(`
          CREATE TABLE service_queues (
            id SERIAL PRIMARY KEY,
            organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL, -- e.g., OPD, Pharmacy, Billing
            description TEXT,
            max_tokens_per_day INTEGER DEFAULT 100,
            avg_service_time INTEGER DEFAULT 10, -- in minutes
            is_active BOOLEAN DEFAULT TRUE,
            is_priority_enabled BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created service_queues table');
      }

      if (!existingTables.includes('tokens')) {
        await targetPool.query(`
          CREATE TABLE tokens (
            id SERIAL PRIMARY KEY,
            token_number VARCHAR(20) NOT NULL, -- e.g., TKN001
            queue_id INTEGER REFERENCES service_queues(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- NULL for walk-in tokens
            organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
            status VARCHAR(50) NOT NULL DEFAULT 'waiting', -- waiting, serving, completed, cancelled
            priority BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            served_at TIMESTAMP NULL,
            completed_at TIMESTAMP NULL,
            estimated_wait_time INTEGER, -- in minutes
            called_at TIMESTAMP NULL,
            token_position INTEGER, -- position in the queue when created
            is_walk_in BOOLEAN DEFAULT FALSE
          );
        `);
        console.log('✅ Created tokens table');
      }

      if (!existingTables.includes('queue_status')) {
        await targetPool.query(`
          CREATE TABLE queue_status (
            id SERIAL PRIMARY KEY,
            queue_id INTEGER REFERENCES service_queues(id) ON DELETE CASCADE,
            current_serving_token_id INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
            last_called_token_id INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
            total_tokens_today INTEGER DEFAULT 0,
            tokens_served_today INTEGER DEFAULT 0,
            avg_wait_time INTEGER DEFAULT 0, -- in minutes
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created queue_status table');
      }

      if (!existingTables.includes('notifications')) {
        await targetPool.query(`
          CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL, -- sms, email, push, voice
            message TEXT NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, failed
            sent_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created notifications table');
      }

      if (!existingTables.includes('feedback')) {
        await targetPool.query(`
          CREATE TABLE feedback (
            id SERIAL PRIMARY KEY,
            token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created feedback table');
      }

      if (!existingTables.includes('audit_logs')) {
        await targetPool.query(`
          CREATE TABLE audit_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            action VARCHAR(255) NOT NULL,
            table_name VARCHAR(255),
            record_id INTEGER,
            old_values JSONB,
            new_values JSONB,
            ip_address INET,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Created audit_logs table');
      }

      // Create indexes only if they don't exist
      const indexesResult = await targetPool.query(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
      `);
      const existingIndexes = indexesResult.rows.map(row => row.indexname);

      if (!existingIndexes.includes('idx_users_email')) {
        await targetPool.query(`
          CREATE INDEX idx_users_email ON users(email);
        `);
        console.log('✅ Created idx_users_email index');
      }

      if (!existingIndexes.includes('idx_organizations_code')) {
        await targetPool.query(`
          CREATE INDEX idx_organizations_code ON organizations(code);
        `);
        console.log('✅ Created idx_organizations_code index');
      }

      if (!existingIndexes.includes('idx_organizations_location')) {
        await targetPool.query(`
          CREATE INDEX idx_organizations_location ON organizations(latitude, longitude);
        `);
        console.log('✅ Created idx_organizations_location index');
      }

      if (!existingIndexes.includes('idx_org_users_user_id')) {
        await targetPool.query(`
          CREATE INDEX idx_org_users_user_id ON organization_users(user_id);
        `);
        console.log('✅ Created idx_org_users_user_id index');
      }

      if (!existingIndexes.includes('idx_org_users_org_id')) {
        await targetPool.query(`
          CREATE INDEX idx_org_users_org_id ON organization_users(organization_id);
        `);
        console.log('✅ Created idx_org_users_org_id index');
      }

      if (!existingIndexes.includes('idx_service_queues_org_id')) {
        await targetPool.query(`
          CREATE INDEX idx_service_queues_org_id ON service_queues(organization_id);
        `);
        console.log('✅ Created idx_service_queues_org_id index');
      }

      if (!existingIndexes.includes('idx_tokens_queue_id')) {
        await targetPool.query(`
          CREATE INDEX idx_tokens_queue_id ON tokens(queue_id);
        `);
        console.log('✅ Created idx_tokens_queue_id index');
      }

      if (!existingIndexes.includes('idx_tokens_user_id')) {
        await targetPool.query(`
          CREATE INDEX idx_tokens_user_id ON tokens(user_id);
        `);
        console.log('✅ Created idx_tokens_user_id index');
      }

      if (!existingIndexes.includes('idx_tokens_status')) {
        await targetPool.query(`
          CREATE INDEX idx_tokens_status ON tokens(status);
        `);
        console.log('✅ Created idx_tokens_status index');
      }

      if (!existingIndexes.includes('idx_tokens_token_number')) {
        await targetPool.query(`
          CREATE INDEX idx_tokens_token_number ON tokens(token_number);
        `);
        console.log('✅ Created idx_tokens_token_number index');
      }

      if (!existingIndexes.includes('idx_tokens_created_at')) {
        await targetPool.query(`
          CREATE INDEX idx_tokens_created_at ON tokens(created_at);
        `);
        console.log('✅ Created idx_tokens_created_at index');
      }

      if (!existingIndexes.includes('idx_queue_status_queue_id')) {
        await targetPool.query(`
          CREATE INDEX idx_queue_status_queue_id ON queue_status(queue_id);
        `);
        console.log('✅ Created idx_queue_status_queue_id index');
      }

      if (!existingIndexes.includes('idx_notifications_token_id')) {
        await targetPool.query(`
          CREATE INDEX idx_notifications_token_id ON notifications(token_id);
        `);
        console.log('✅ Created idx_notifications_token_id index');
      }

      if (!existingIndexes.includes('idx_notifications_user_id')) {
        await targetPool.query(`
          CREATE INDEX idx_notifications_user_id ON notifications(user_id);
        `);
        console.log('✅ Created idx_notifications_user_id index');
      }

      if (!existingIndexes.includes('idx_notifications_status')) {
        await targetPool.query(`
          CREATE INDEX idx_notifications_status ON notifications(status);
        `);
        console.log('✅ Created idx_notifications_status index');
      }

      if (!existingIndexes.includes('idx_feedback_token_id')) {
        await targetPool.query(`
          CREATE INDEX idx_feedback_token_id ON feedback(token_id);
        `);
        console.log('✅ Created idx_feedback_token_id index');
      }

      if (!existingIndexes.includes('idx_feedback_user_id')) {
        await targetPool.query(`
          CREATE INDEX idx_feedback_user_id ON feedback(user_id);
        `);
        console.log('✅ Created idx_feedback_user_id index');
      }

      // Create triggers only if they don't exist
      const triggersResult = await targetPool.query(`
        SELECT tgname 
        FROM pg_trigger
        WHERE NOT tgisinternal
      `);
      const existingTriggers = triggersResult.rows.map(row => row.tgname);

      if (!existingTriggers.includes('update_updated_at_column')) {
        await targetPool.query(`
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = CURRENT_TIMESTAMP;
              RETURN NEW;
          END;
          $$ language 'plpgsql';
        `);
        console.log('✅ Created update_updated_at_column function');
      }

      if (!existingTriggers.includes('update_users_updated_at')) {
        await targetPool.query(`
          CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Created update_users_updated_at trigger');
      }

      if (!existingTriggers.includes('update_organizations_updated_at')) {
        await targetPool.query(`
          CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Created update_organizations_updated_at trigger');
      }

      if (!existingTriggers.includes('update_service_queues_updated_at')) {
        await targetPool.query(`
          CREATE TRIGGER update_service_queues_updated_at BEFORE UPDATE ON service_queues
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Created update_service_queues_updated_at trigger');
      }

      if (!existingTriggers.includes('update_tokens_updated_at')) {
        await targetPool.query(`
          CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Created update_tokens_updated_at trigger');
      }

      console.log(`\n✅ All missing tables, indexes, and triggers created successfully!`);
    } else {
      console.log('✅ All required tables already exist. No changes made.');
    }

    // Test the connection by running a simple query
    const testResult = await targetPool.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', testResult.rows[0]);
    
    console.log('\n🎉 Database setup complete! Your Q-Ease application is ready to use with PostgreSQL.');
    
    await targetPool.end();
    
  } catch (error) {
    console.error('❌ Error during database setup:', error.message);
    throw error;
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  });
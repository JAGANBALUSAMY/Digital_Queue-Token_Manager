# Q-Ease Database Schema

This document outlines the database schema for the Q-Ease queue management system.

## Tables

### 1. users
Stores information about all users (customers, staff, managers, owners).

```sql
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
```

### 2. organizations
Stores information about registered organizations.

```sql
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
```

### 3. organization_users
Associates users with organizations and defines their roles within the organization.

```sql
CREATE TABLE organization_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- staff, manager, owner
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, organization_id)
);
```

### 4. service_queues
Defines service queues for each organization.

```sql
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
```

### 5. tokens
Stores information about generated tokens.

```sql
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
```

### 6. queue_status
Tracks real-time status of queues.

```sql
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
```

### 7. notifications
Stores notification records.

```sql
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
```

### 8. feedback
Stores feedback from users after service completion.

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  token_id INTEGER REFERENCES tokens(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. announcements
Stores announcements and notifications for organizations and queues.

```sql
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  queue_id INTEGER REFERENCES service_queues(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'normal', -- normal, high, urgent
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP NULL,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. audit_logs
Tracks important system events for security and compliance.

```sql
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

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Organizations
CREATE INDEX idx_organizations_code ON organizations(code);
CREATE INDEX idx_organizations_location ON organizations(latitude, longitude);

-- Organization Users
CREATE INDEX idx_org_users_user_id ON organization_users(user_id);
CREATE INDEX idx_org_users_org_id ON organization_users(organization_id);

-- Service Queues
CREATE INDEX idx_service_queues_org_id ON service_queues(organization_id);

-- Tokens
CREATE INDEX idx_tokens_queue_id ON tokens(queue_id);
CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_status ON tokens(status);
CREATE INDEX idx_tokens_token_number ON tokens(token_number);
CREATE INDEX idx_tokens_created_at ON tokens(created_at);

-- Queue Status
CREATE INDEX idx_queue_status_queue_id ON queue_status(queue_id);

-- Notifications
CREATE INDEX idx_notifications_token_id ON notifications(token_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- Feedback
CREATE INDEX idx_feedback_token_id ON feedback(token_id);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
```

## Triggers

```sql
-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables that have updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_queues_updated_at BEFORE UPDATE ON service_queues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
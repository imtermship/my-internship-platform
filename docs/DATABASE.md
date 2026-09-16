# Database Setup Guide

## Prerequisites
- PostgreSQL 14+
- Node.js 18+

## Installation

### 1. Create Database
```bash
createdb my_internship
```

### 2. Create Tables

Run the following SQL script:

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) CHECK (role IN ('student', 'employer', 'institution', 'admin')),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  institution_id UUID,
  cv_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Institutions
CREATE TABLE institutions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internship Listings
CREATE TABLE internship_listings (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  work_mode VARCHAR(50) CHECK (work_mode IN ('remote', 'onsite', 'hybrid')),
  start_date DATE,
  end_date DATE,
  duration_weeks INTEGER,
  salary DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  internship_id UUID NOT NULL REFERENCES internship_listings(id),
  student_id UUID NOT NULL REFERENCES student_profiles(id),
  status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'shortlisted', 'accepted', 'rejected')),
  cover_letter TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Placements
CREATE TABLE placements (
  id UUID PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  student_id UUID NOT NULL REFERENCES student_profiles(id),
  institution_id UUID REFERENCES institutions(id),
  internship_id UUID NOT NULL REFERENCES internship_listings(id),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Acceptance Records
CREATE TABLE acceptance_records (
  id UUID PRIMARY KEY,
  placement_id UUID NOT NULL REFERENCES placements(id),
  verification_code VARCHAR(255) UNIQUE NOT NULL,
  qr_code_data TEXT,
  pdf_url VARCHAR(500),
  verified_at TIMESTAMP,
  verified_by_company UUID REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Completion Records
CREATE TABLE completion_records (
  id UUID PRIMARY KEY,
  placement_id UUID NOT NULL REFERENCES placements(id),
  document_url VARCHAR(500),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) CHECK (type IN ('placement', 'acceptance', 'rejection', 'completion')),
  message TEXT,
  data JSON,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Events
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(100),
  entity_id UUID,
  event_type VARCHAR(100),
  actor_id UUID REFERENCES users(id),
  changes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_internship_listings_company_id ON internship_listings(company_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_placements_student_id ON placements(student_id);
CREATE INDEX idx_placements_company_id ON placements(company_id);
CREATE INDEX idx_acceptance_records_verification_code ON acceptance_records(verification_code);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_events_entity_id ON audit_events(entity_id);
```

## Connection String
```
postgresql://postgres:password@localhost:5432/my_internship
```

## Environment Variables
Add to `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/my_internship
```

## Verify Connection
```bash
psql postgresql://postgres:password@localhost:5432/my_internship
```

You should see the `my_internship=#` prompt.

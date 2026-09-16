# Database Schema for MY Internship Platform

## Tables

### users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- role (ENUM: student, employer, institution, admin)
- phone (VARCHAR, nullable)
- avatar_url (VARCHAR, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### student_profiles
- id (UUID, PK)
- user_id (UUID, FK → users)
- institution_id (UUID, FK → institutions, nullable)
- cv_url (VARCHAR, nullable)
- bio (TEXT, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### companies
- id (UUID, PK)
- user_id (UUID, FK → users)
- company_name (VARCHAR)
- description (TEXT, nullable)
- website (VARCHAR, nullable)
- logo_url (VARCHAR, nullable)
- verification_status (ENUM: pending, verified, rejected)
- verified_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### institutions
- id (UUID, PK)
- name (VARCHAR)
- description (TEXT, nullable)
- website (VARCHAR, nullable)
- logo_url (VARCHAR, nullable)
- verified_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### internship_listings
- id (UUID, PK)
- company_id (UUID, FK → companies)
- title (VARCHAR)
- description (TEXT)
- location (VARCHAR)
- work_mode (ENUM: remote, onsite, hybrid)
- start_date (DATE)
- end_date (DATE)
- duration_weeks (INTEGER)
- salary (DECIMAL, nullable)
- status (ENUM: active, closed, archived)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### applications
- id (UUID, PK)
- internship_id (UUID, FK → internship_listings)
- student_id (UUID, FK → student_profiles)
- status (ENUM: applied, reviewed, shortlisted, accepted, rejected)
- cover_letter (TEXT, nullable)
- applied_at (TIMESTAMP)
- decided_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### placements
- id (UUID, PK)
- application_id (UUID, FK → applications)
- company_id (UUID, FK → companies)
- student_id (UUID, FK → student_profiles)
- institution_id (UUID, FK → institutions)
- internship_id (UUID, FK → internship_listings)
- status (ENUM: active, completed, terminated)
- start_date (DATE)
- end_date (DATE, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### acceptance_records
- id (UUID, PK)
- placement_id (UUID, FK → placements)
- verification_code (VARCHAR, UNIQUE)
- qr_code_data (TEXT)
- pdf_url (VARCHAR, nullable)
- verified_at (TIMESTAMP, nullable)
- verified_by_company (UUID, FK → companies, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### completion_records
- id (UUID, PK)
- placement_id (UUID, FK → placements)
- document_url (VARCHAR, nullable)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### notifications
- id (UUID, PK)
- user_id (UUID, FK → users)
- type (ENUM: placement, acceptance, rejection, completion)
- message (TEXT)
- data (JSON)
- read_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)

### audit_events
- id (UUID, PK)
- entity_type (VARCHAR)
- entity_id (UUID)
- event_type (VARCHAR)
- actor_id (UUID, FK → users)
- changes (JSON)
- created_at (TIMESTAMP)

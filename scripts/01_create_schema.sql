-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (for admin/staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'attendee')),
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(500),
  max_attendees INTEGER,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Attendees table
CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  job_title VARCHAR(255),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  check_in_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in', 'no_show')),
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_issue_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificate templates table
CREATE TABLE certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  signature_image_url VARCHAR(500),
  background_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  template_id UUID REFERENCES certificate_templates(id),
  certificate_number VARCHAR(50) UNIQUE,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  total_registered INTEGER DEFAULT 0,
  total_checked_in INTEGER DEFAULT 0,
  total_certificates_issued INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_attendees_event_id ON attendees(event_id);
CREATE INDEX idx_attendees_email ON attendees(email);
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_certificates_attendee_id ON certificates(attendee_id);
CREATE INDEX idx_certificates_event_id ON certificates(event_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT 
  USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Events policies
CREATE POLICY "Anyone can select events" ON events FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert events" ON events FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update events" ON events FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Attendees policies
CREATE POLICY "Anyone can select attendees" ON attendees FOR SELECT 
  USING (true);

-- Using WITH CHECK for INSERT operations instead of USING
CREATE POLICY "Admins can insert attendees" ON attendees FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Admins can update attendees" ON attendees FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'staff');

-- Certificates policies
CREATE POLICY "Anyone can select certificates" ON certificates FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert certificates" ON certificates FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update certificates" ON certificates FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Organizations policies
CREATE POLICY "Anyone can select organizations" ON organizations FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert organizations" ON organizations FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Certificate templates policies
CREATE POLICY "Anyone can select templates" ON certificate_templates FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage templates" ON certificate_templates FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update templates" ON certificate_templates FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Analytics policies
CREATE POLICY "Anyone can select analytics" ON analytics FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert analytics" ON analytics FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

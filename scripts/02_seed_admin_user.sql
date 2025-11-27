-- Seed VPAA Admin User
-- Email: vpaa-admin@gmail.com
-- Password: vpaaadmin123
-- Using bcrypt hash for vpaaadmin123

INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
VALUES (
  'vpaa-admin@gmail.com',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', -- bcrypt hash of 'vpaaadmin123'
  'VPAA Administrator',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Seed VPAA Organization
INSERT INTO organizations (name, logo_url, created_at)
VALUES (
  'Veterinary Practitioners Association of Australia',
  'https://via.placeholder.com/200',
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- Add mock users with different roles
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test.caregiver1@example.com', '{"name": "Test Caregiver 1"}'),
  ('00000000-0000-0000-0000-000000000002', 'test.caregiver2@example.com', '{"name": "Test Caregiver 2"}'),
  ('00000000-0000-0000-0000-000000000003', 'test.admin@example.com', '{"name": "Test Admin"}'),
  ('00000000-0000-0000-0000-000000000004', 'test.superadmin@example.com', '{"name": "Test Super Admin"}'),
  ('00000000-0000-0000-0000-000000000005', 'test.inactive@example.com', '{"name": "Test Inactive User"}');

-- Add corresponding profiles with roles
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test.caregiver1@example.com', 'Test Caregiver 1', 'caregiver', true),
  ('00000000-0000-0000-0000-000000000002', 'test.caregiver2@example.com', 'Test Caregiver 2', 'caregiver', true),
  ('00000000-0000-0000-0000-000000000003', 'test.admin@example.com', 'Test Admin', 'admin', true),
  ('00000000-0000-0000-0000-000000000004', 'test.superadmin@example.com', 'Test Super Admin', 'super_admin', true),
  ('00000000-0000-0000-0000-000000000005', 'test.inactive@example.com', 'Test Inactive User', 'caregiver', false);

-- Add mock patients with various conditions and demographics
INSERT INTO public.patients (id, name, date_of_birth, gender, notes, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test Patient 1', '1990-01-01', 'male', 'Diabetes Type 2, Regular check-ups needed', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Test Patient 2', '1985-05-15', 'female', 'Hypertension, Daily blood pressure monitoring', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Test Patient 3', '1995-12-31', 'other', 'Asthma, Requires inhaler assistance', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Test Patient 4', '1978-03-22', 'female', 'Arthritis, Mobility assistance needed', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Test Patient 5', '1992-07-08', 'male', 'Post-surgery recovery, Physical therapy', NOW());

-- Assign patients to caregivers (including multiple caregivers per patient)
INSERT INTO public.caregiver_patient_assignments (caregiver_id, patient_id)
VALUES 
  -- Caregiver 1 assignments
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'),
  ('00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333'),
  
  -- Caregiver 2 assignments
  ('00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
  ('00000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333'),
  ('00000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444'),
  
  -- Inactive user assignments (to test handling of inactive users)
  ('00000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555');

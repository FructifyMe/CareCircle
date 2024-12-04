-- Add mock users with different roles
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test.caregiver1@example.com', '{"name": "Test Caregiver 1"}'),
  ('00000000-0000-0000-0000-000000000002', 'test.caregiver2@example.com', '{"name": "Test Caregiver 2"}'),
  ('00000000-0000-0000-0000-000000000003', 'test.admin@example.com', '{"name": "Test Admin"}');

-- Add corresponding profiles with roles
INSERT INTO public.profiles (id, email, name, role, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test.caregiver1@example.com', 'Test Caregiver 1', 'caregiver', true),
  ('00000000-0000-0000-0000-000000000002', 'test.caregiver2@example.com', 'Test Caregiver 2', 'caregiver', true),
  ('00000000-0000-0000-0000-000000000003', 'test.admin@example.com', 'Test Admin', 'admin', true);

-- Add mock patients
INSERT INTO public.patients (id, name, date_of_birth, gender, notes, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test Patient 1', '1990-01-01', 'male', 'Test patient notes 1', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Test Patient 2', '1985-05-15', 'female', 'Test patient notes 2', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Test Patient 3', '1995-12-31', 'other', 'Test patient notes 3', NOW());

-- Assign patients to caregivers
INSERT INTO public.caregiver_patient_assignments (caregiver_id, patient_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'),
  ('00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
  ('00000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333');

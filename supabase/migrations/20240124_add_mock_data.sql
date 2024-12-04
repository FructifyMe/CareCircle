-- Add mock users with different roles
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test.caregiver1@example.com', '{"name": "Test Caregiver 1"}'),
  ('00000000-0000-0000-0000-000000000002', 'test.caregiver2@example.com', '{"name": "Test Caregiver 2"}'),
  ('00000000-0000-0000-0000-000000000003', 'test.admin@example.com', '{"name": "Test Admin"}'),
  ('00000000-0000-0000-0000-000000000004', 'test.superadmin@example.com', '{"name": "Test Super Admin"}'),
  ('00000000-0000-0000-0000-000000000005', 'test.inactive@example.com', '{"name": "Test Inactive User"}');

-- Add corresponding caregivers
INSERT INTO public.caregivers (id, name, email, role, auth_id)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Test Caregiver 1', 'test.caregiver1@example.com', 'caregiver', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'Test Caregiver 2', 'test.caregiver2@example.com', 'caregiver', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003', 'Test Admin', 'test.admin@example.com', 'admin', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000004', 'Test Super Admin', 'test.superadmin@example.com', 'super_admin', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000005', 'Test Inactive User', 'test.inactive@example.com', 'caregiver', '00000000-0000-0000-0000-000000000005');

-- Add mock patients
INSERT INTO public.patients (id, name, age, condition, address, emergency_contact)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test Patient 1', 33, 'Diabetes Type 2', '123 Main St, City, State', '555-0001'),
  ('22222222-2222-2222-2222-222222222222', 'Test Patient 2', 38, 'Hypertension', '456 Oak Ave, City, State', '555-0002'),
  ('33333333-3333-3333-3333-333333333333', 'Test Patient 3', 28, 'Asthma', '789 Pine Rd, City, State', '555-0003'),
  ('44444444-4444-4444-4444-444444444444', 'Test Patient 4', 45, 'Arthritis', '321 Elm St, City, State', '555-0004'),
  ('55555555-5555-5555-5555-555555555555', 'Test Patient 5', 31, 'Post-surgery recovery', '654 Maple Dr, City, State', '555-0005');

-- Update caregiver patient assignments
UPDATE public.caregivers 
SET patient_ids = array_append(patient_ids, '11111111-1111-1111-1111-111111111111'::uuid)
WHERE id = '10000000-0000-0000-0000-000000000001';

UPDATE public.caregivers 
SET patient_ids = array_append(patient_ids, '22222222-2222-2222-2222-222222222222'::uuid)
WHERE id = '10000000-0000-0000-0000-000000000001';

UPDATE public.caregivers 
SET patient_ids = array_append(patient_ids, '22222222-2222-2222-2222-222222222222'::uuid)
WHERE id = '10000000-0000-0000-0000-000000000002';

UPDATE public.caregivers 
SET patient_ids = array_append(patient_ids, '33333333-3333-3333-3333-333333333333'::uuid)
WHERE id = '10000000-0000-0000-0000-000000000002';

-- Add some care tasks
INSERT INTO public.care_tasks (patient_id, caregiver_id, title, description, due_date, priority, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'Blood Sugar Check', 'Check and record blood sugar levels', NOW() + INTERVAL '1 day', 'high', 'pending'),
  ('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000001', 'Blood Pressure Reading', 'Take blood pressure measurement', NOW() + INTERVAL '2 days', 'medium', 'pending'),
  ('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000002', 'Inhaler Assistance', 'Help with daily inhaler routine', NOW() + INTERVAL '1 day', 'high', 'pending');

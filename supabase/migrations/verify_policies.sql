-- Check all policies on caregivers table
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'caregivers';

-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'caregivers' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

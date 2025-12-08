-- Drop the insecure powens_users_safe view
-- The secure SECURITY DEFINER functions (has_powens_connection, get_powens_user_safe) 
-- already provide controlled access to this data without exposing it publicly
DROP VIEW IF EXISTS public.powens_users_safe;
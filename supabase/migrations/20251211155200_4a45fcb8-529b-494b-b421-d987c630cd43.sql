-- Drop Powens-related database functions
DROP FUNCTION IF EXISTS public.has_powens_connection(uuid);
DROP FUNCTION IF EXISTS public.get_powens_user_safe(uuid);

-- Drop Powens-related tables (order matters for potential dependencies)
DROP TABLE IF EXISTS public.bank_connections;
DROP TABLE IF EXISTS public.powens_users;
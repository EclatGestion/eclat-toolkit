-- Fix: Prevent client-side access to Powens OAuth tokens
-- Only Edge Functions (service role) should be able to read access_token and refresh_token

-- Step 1: Create a secure view that excludes sensitive token columns
-- This view is what client-side code should use
CREATE OR REPLACE VIEW public.powens_users_safe AS
SELECT 
  id,
  user_id,
  powens_user_id,
  token_expires_at,
  created_at,
  updated_at
FROM public.powens_users;

-- Step 2: Enable RLS on the view
ALTER VIEW public.powens_users_safe SET (security_invoker = true);

-- Step 3: Drop the existing SELECT policy that exposes tokens
DROP POLICY IF EXISTS "Users can view own powens data" ON public.powens_users;

-- Step 4: Create a new SELECT policy that denies all client access
-- Edge Functions with service role bypass RLS, so they can still read tokens
-- Regular authenticated users cannot SELECT from powens_users at all
CREATE POLICY "No client access to tokens"
ON public.powens_users
FOR SELECT
USING (false);

-- Step 5: Grant SELECT on the safe view to authenticated users
GRANT SELECT ON public.powens_users_safe TO authenticated;

-- Step 6: Create RLS policy for the base table access via view
-- Since the view uses security_invoker, the RLS on the base table applies
-- We need a policy that allows the view to work for the right user
DROP POLICY IF EXISTS "No client access to tokens" ON public.powens_users;

-- Actually, let's use a simpler approach:
-- Keep the existing policies but add a helper function to check connection status
-- without exposing tokens

-- Create a secure function to check if user has a Powens connection
CREATE OR REPLACE FUNCTION public.has_powens_connection(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.powens_users
    WHERE user_id = p_user_id
      AND access_token IS NOT NULL
  )
$$;

-- Create a secure function to get non-sensitive Powens user info
CREATE OR REPLACE FUNCTION public.get_powens_user_safe(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  powens_user_id text,
  token_expires_at timestamptz,
  has_valid_token boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    powens_user_id,
    token_expires_at,
    (access_token IS NOT NULL AND (token_expires_at IS NULL OR token_expires_at > now())) as has_valid_token,
    created_at,
    updated_at
  FROM public.powens_users
  WHERE user_id = p_user_id
$$;
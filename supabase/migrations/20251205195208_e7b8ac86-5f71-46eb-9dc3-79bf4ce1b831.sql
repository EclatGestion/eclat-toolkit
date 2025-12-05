-- Table to store Powens user tokens
CREATE TABLE public.powens_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  powens_user_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table to store bank connections
CREATE TABLE public.bank_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  powens_connection_id INTEGER NOT NULL,
  bank_name TEXT,
  bank_logo_url TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.powens_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for powens_users
CREATE POLICY "Users can view own powens data"
ON public.powens_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own powens data"
ON public.powens_users FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own powens data"
ON public.powens_users FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own powens data"
ON public.powens_users FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for bank_connections
CREATE POLICY "Users can view own bank connections"
ON public.bank_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank connections"
ON public.bank_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank connections"
ON public.bank_connections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank connections"
ON public.bank_connections FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_powens_users_updated_at
BEFORE UPDATE ON public.powens_users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bank_connections_updated_at
BEFORE UPDATE ON public.bank_connections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
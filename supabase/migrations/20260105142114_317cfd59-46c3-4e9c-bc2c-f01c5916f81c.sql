-- Create saved_simulations table
CREATE TABLE public.saved_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  tool_type TEXT NOT NULL,
  tool_label TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own simulations" 
ON public.saved_simulations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" 
ON public.saved_simulations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations" 
ON public.saved_simulations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations" 
ON public.saved_simulations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_saved_simulations_updated_at
BEFORE UPDATE ON public.saved_simulations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Add ai_recommendations column to diagnostic_results
ALTER TABLE public.diagnostic_results 
ADD COLUMN ai_recommendations JSONB DEFAULT NULL;

-- Create recommendation_status table
CREATE TABLE public.recommendation_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  diagnostic_id UUID NOT NULL REFERENCES public.diagnostic_results(id) ON DELETE CASCADE,
  recommendation_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, diagnostic_id, recommendation_key)
);

-- Enable RLS
ALTER TABLE public.recommendation_status ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own recommendation status"
ON public.recommendation_status
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendation status"
ON public.recommendation_status
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendation status"
ON public.recommendation_status
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendation status"
ON public.recommendation_status
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_recommendation_status_updated_at
BEFORE UPDATE ON public.recommendation_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
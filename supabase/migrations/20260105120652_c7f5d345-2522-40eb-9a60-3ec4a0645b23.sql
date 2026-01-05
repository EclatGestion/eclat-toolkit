-- Create table for persistent diagnostic results
CREATE TABLE public.diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT DEFAULT 'Mon diagnostic',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Finances personnelles
  revenus INTEGER DEFAULT 0,
  depenses INTEGER DEFAULT 0,
  epargne INTEGER DEFAULT 0,
  credits_restants INTEGER DEFAULT 0,
  
  -- Épargne & Investissements
  liquidites INTEGER DEFAULT 0,
  assurance_vie INTEGER DEFAULT 0,
  per INTEGER DEFAULT 0,
  pea_cto INTEGER DEFAULT 0,
  
  -- Immobilier
  residence_principale INTEGER DEFAULT 0,
  immobilier_locatif INTEGER DEFAULT 0,
  loyers_percus INTEGER DEFAULT 0,
  credits_immo INTEGER DEFAULT 0,
  
  -- Fiscalité
  revenus_imposables INTEGER DEFAULT 0,
  tmi INTEGER DEFAULT 30,
  per_utilise BOOLEAN DEFAULT false,
  lmnp_utilise BOOLEAN DEFAULT false,
  
  -- Transmission
  situation_familiale TEXT DEFAULT 'celibataire',
  nombre_enfants INTEGER DEFAULT 0,
  donations_realisees INTEGER DEFAULT 0,
  assurance_vie_beneficiaire BOOLEAN DEFAULT false,
  
  -- Scores calculés
  score_global INTEGER DEFAULT 0,
  patrimoine_total INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own diagnostics"
  ON public.diagnostic_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnostics"
  ON public.diagnostic_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostics"
  ON public.diagnostic_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostics"
  ON public.diagnostic_results FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_diagnostic_results_updated_at
  BEFORE UPDATE ON public.diagnostic_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
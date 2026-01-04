-- Ajout des champs de qualification au profil utilisateur
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS investment_goal TEXT,
ADD COLUMN IF NOT EXISTS investment_horizon TEXT,
ADD COLUMN IF NOT EXISTS professional_status TEXT,
ADD COLUMN IF NOT EXISTS age_range TEXT,
ADD COLUMN IF NOT EXISTS investment_capacity TEXT,
ADD COLUMN IF NOT EXISTS segment TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS patrimoine_estime INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS revenus_annuels INTEGER DEFAULT 0;

-- Commentaires pour documentation
COMMENT ON COLUMN public.profiles.investment_goal IS 'Objectif principal: reduire_impots, preparer_retraite, acheter_immo, faire_fructifier, transmettre, ne_sais_pas';
COMMENT ON COLUMN public.profiles.investment_horizon IS 'Horizon: court_terme, moyen_terme, long_terme';
COMMENT ON COLUMN public.profiles.professional_status IS 'Situation pro: salarie, tns, retraite, autre';
COMMENT ON COLUMN public.profiles.age_range IS 'Tranche age: 18-30, 30-45, 45-55, 55+';
COMMENT ON COLUMN public.profiles.investment_capacity IS 'Capacite: moins_10k, 10k_30k, 30k_100k, 100k_500k, plus_500k';
COMMENT ON COLUMN public.profiles.segment IS 'Segment calcule: starter, accompagne';
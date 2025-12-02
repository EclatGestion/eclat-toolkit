-- Create table for expense analyses
CREATE TABLE public.expense_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT,
  source TEXT DEFAULT 'pdf',
  analysis_date TIMESTAMPTZ DEFAULT now(),
  raw_transactions JSONB,
  categorized_expenses JSONB,
  top_expenses JSONB,
  recommendations JSONB,
  total_amount DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expense_analyses ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own analyses"
ON public.expense_analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
ON public.expense_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
ON public.expense_analyses FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for bank statements
INSERT INTO storage.buckets (id, name, public)
VALUES ('bank-statements', 'bank-statements', false);

-- Storage policies
CREATE POLICY "Users can upload own statements"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bank-statements' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own statements"
ON storage.objects FOR SELECT
USING (bucket_id = 'bank-statements' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own statements"
ON storage.objects FOR DELETE
USING (bucket_id = 'bank-statements' AND auth.uid()::text = (storage.foldername(name))[1]);
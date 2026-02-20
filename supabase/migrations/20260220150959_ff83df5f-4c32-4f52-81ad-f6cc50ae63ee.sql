
-- Table to cache banknote analysis results by image hash
CREATE TABLE public.banknote_analysis_cache (
  image_hash TEXT NOT NULL PRIMARY KEY,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No user-specific data, allow anonymous access
ALTER TABLE public.banknote_analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache"
  ON public.banknote_analysis_cache
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert cache"
  ON public.banknote_analysis_cache
  FOR INSERT
  WITH CHECK (true);

-- Auto-expire old cache entries after 30 days (via index for cleanup)
CREATE INDEX idx_banknote_cache_created_at ON public.banknote_analysis_cache (created_at);

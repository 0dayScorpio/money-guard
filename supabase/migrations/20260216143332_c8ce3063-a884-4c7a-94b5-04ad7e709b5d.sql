
-- Table to track daily scan usage per device
CREATE TABLE public.scan_usage (
  device_id TEXT NOT NULL,
  scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scan_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (device_id, scan_date)
);

-- Allow anonymous access (no auth required - device-based tracking)
ALTER TABLE public.scan_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON public.scan_usage FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.scan_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.scan_usage FOR UPDATE USING (true);

-- RPC function to atomically consume a scan
CREATE OR REPLACE FUNCTION public.consume_scan(p_device_id TEXT, p_daily_limit INTEGER DEFAULT 5)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_count INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  -- Upsert: insert or get existing row for today
  INSERT INTO public.scan_usage (device_id, scan_date, scan_count, updated_at)
  VALUES (p_device_id, today, 0, now())
  ON CONFLICT (device_id, scan_date) DO NOTHING;

  -- Lock the row and get current count
  SELECT scan_count INTO current_count
  FROM public.scan_usage
  WHERE device_id = p_device_id AND scan_date = today
  FOR UPDATE;

  IF current_count >= p_daily_limit THEN
    RETURN json_build_object(
      'allowed', false,
      'remaining', 0,
      'limit', p_daily_limit,
      'used', current_count
    );
  END IF;

  -- Increment
  UPDATE public.scan_usage
  SET scan_count = scan_count + 1, updated_at = now()
  WHERE device_id = p_device_id AND scan_date = today;

  RETURN json_build_object(
    'allowed', true,
    'remaining', p_daily_limit - current_count - 1,
    'limit', p_daily_limit,
    'used', current_count + 1
  );
END;
$$;

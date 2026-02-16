
-- Fix search_path warning
CREATE OR REPLACE FUNCTION public.consume_scan(p_device_id TEXT, p_daily_limit INTEGER DEFAULT 5)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  current_count INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  INSERT INTO public.scan_usage (device_id, scan_date, scan_count, updated_at)
  VALUES (p_device_id, today, 0, now())
  ON CONFLICT (device_id, scan_date) DO NOTHING;

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

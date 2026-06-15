
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Service role can update images"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'images');

CREATE POLICY "Service role can delete images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'images');

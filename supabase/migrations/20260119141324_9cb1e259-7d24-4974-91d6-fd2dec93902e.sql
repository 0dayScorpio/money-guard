-- Create a public storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Allow public read access to all files in the images bucket
CREATE POLICY "Public read access for images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');
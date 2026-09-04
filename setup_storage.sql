-- Run this in the Supabase SQL Editor to set up the photos storage bucket

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone to view/read images in photos
CREATE POLICY "Public Access for photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'photos');

-- 4. Policy: Allow authenticated farmers to upload photos
CREATE POLICY "Farmers can upload photos" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- 5. Policy: Allow authenticated farmers to delete their own photos (optional, but good practice)
CREATE POLICY "Farmers can delete own photos" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Migration v3.7: Skills Admin & Storage Refactor
-- Run this in your Supabase SQL Editor

-- Create storage bucket for skill images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('skill-images', 'skill-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for skill-images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'skill-images');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'skill-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'skill-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'skill-images' AND auth.role() = 'authenticated');

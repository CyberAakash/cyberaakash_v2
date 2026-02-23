-- Migration v3.8: Socials Table & Archiving System
-- Run this in your Supabase SQL Editor

-- 1. Create socials table
CREATE TABLE IF NOT EXISTS socials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add is_archived column to existing tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- 3. Create storage bucket for social images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('social-images', 'social-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up storage policies for social-images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'social-images');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'social-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'social-images' AND auth.role() = 'authenticated');

-- 5. Set up RLS for socials table
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON socials FOR SELECT USING (NOT is_archived);
CREATE POLICY "Authenticated All" ON socials FOR ALL USING (auth.role() = 'authenticated');

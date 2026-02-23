-- Migration v4.0: Storage Bucket RLS Fixes
-- Run this in your Supabase SQL Editor

-- 1. Ensure all required buckets exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('project-images', 'project-images', true),
    ('blog-images', 'blog-images', true),
    ('skill-images', 'skill-images', true),
    ('social-images', 'social-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clean up old policies to avoid conflicts (optional but recommended for a clean state)
-- Drop existing policies if they might conflict with names
DROP POLICY IF EXISTS "Public Access Project Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Manage Project Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Blog Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Manage Blog Images" ON storage.objects;

-- 3. Set up Universal policies for all portfolio buckets
-- Instead of per-bucket, we can use bucket_id in the policy

-- ALLOW PUBLIC READ ACCESS
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('project-images', 'blog-images', 'skill-images', 'social-images'));

-- ALLOW AUTHENTICATED MANAGE ACCESS (INSERT/UPDATE/DELETE)
CREATE POLICY "Admin Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id IN ('project-images', 'blog-images', 'skill-images', 'social-images') 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id IN ('project-images', 'blog-images', 'skill-images', 'social-images') 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
    bucket_id IN ('project-images', 'blog-images', 'skill-images', 'social-images') 
    AND auth.role() = 'authenticated'
);

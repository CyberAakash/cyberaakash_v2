-- Migration v4.5: Storage Buckets & RLS Policies

-- 1. Create Buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery-images', 'gallery-images', true),
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true),
  ('experience-images', 'experience-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (if not already enabled)
-- Note: Supabase typically has this enabled by default, but we'll include it for completeness.
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policies
-- Allows anyone to view images in these buckets
CREATE POLICY "Public Read Gallery Images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Public Read Project Images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public Read Blog Images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public Read Experience Images" ON storage.objects FOR SELECT USING (bucket_id = 'experience-images');

-- 4. Admin Management Policies
-- Allows authenticated users (admins) to perform all actions
CREATE POLICY "Admin CRUD Gallery Images" ON storage.objects FOR ALL 
  TO authenticated 
  USING (bucket_id = 'gallery-images') 
  WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Admin CRUD Project Images" ON storage.objects FOR ALL 
  TO authenticated 
  USING (bucket_id = 'project-images') 
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Admin CRUD Blog Images" ON storage.objects FOR ALL 
  TO authenticated 
  USING (bucket_id = 'blog-images') 
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Admin CRUD Experience Images" ON storage.objects FOR ALL 
  TO authenticated 
  USING (bucket_id = 'experience-images') 
  WITH CHECK (bucket_id = 'experience-images');

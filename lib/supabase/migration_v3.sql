-- =====================================
-- CyberAakash v3 — Migration Script
-- Run this in Supabase SQL Editor
-- =====================================

-- 1. Add new columns to projects table (safe if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='slug') THEN
    ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images') THEN
    ALTER TABLE projects ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='tags') THEN
    ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 2. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS on blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for blogs (drop first if they exist to avoid errors)
DROP POLICY IF EXISTS "Public read published blogs" ON blogs;
CREATE POLICY "Public read published blogs" ON blogs
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Auth users manage blogs" ON blogs;
CREATE POLICY "Auth users manage blogs" ON blogs
  FOR ALL USING (auth.role() = 'authenticated');

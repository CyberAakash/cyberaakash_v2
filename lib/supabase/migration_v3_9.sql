-- Migration v3.9: Complete Archiving System
-- Run this in your Supabase SQL Editor

-- 1. Add is_archived column to remaining tables
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- 2. Ensure RLS policies are updated for socials (Public Read already handled in v3.8)
-- For others, we assume you might want to filter on the frontend (as done in app/page.tsx)
-- or you can update policies here if desired.

-- Migration v4.6: Add is_archived to gallery table

-- 1. Add column if it doesn't exist
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- 2. Update RLS policies to handle is_archived
-- Public read should only see images that are NOT archived and are visible
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (is_visible = true AND is_archived = false);

-- Auth manage policy already covers all actions for authenticated users,
-- but we ensure authenticated users can see archived items too for the admin panel.
DROP POLICY IF EXISTS "Auth manage gallery" ON gallery;
CREATE POLICY "Auth manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

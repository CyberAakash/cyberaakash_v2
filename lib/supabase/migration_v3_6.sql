-- ============================================
-- Migration v3.6: Portfolio Refactoring
-- ============================================

-- Skills update: Add image_url for visual representation
ALTER TABLE skills ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Blogs update: Add is_featured for home page highlighting
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Site Config: Add featured limits
INSERT INTO site_config (key, value)
VALUES 
  ('featured_projects_limit', '6'::jsonb),
  ('featured_blogs_limit', '6'::jsonb)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- Ensure all current blogs have is_featured set
UPDATE blogs SET is_featured = false WHERE is_featured IS NULL;

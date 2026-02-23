-- Migration v4.2: Add is_featured to events + featured limits config

-- Add is_featured column to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
UPDATE events SET is_featured = false WHERE is_featured IS NULL;

-- Add featured limit config keys (DO NOTHING if already exist)
INSERT INTO site_config (key, value) VALUES ('featured_events_limit',   '4') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('featured_projects_limit', '6') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_config (key, value) VALUES ('featured_blogs_limit',    '6') ON CONFLICT (key) DO NOTHING;

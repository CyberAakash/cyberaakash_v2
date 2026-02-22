-- ============================================
-- Migration v3.5: Events detail routes & Markdown content
-- ============================================

-- Add slug column to events (required for detail routes)
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add images array for multi-image support (gallery)
ALTER TABLE events ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add content column for Markdown-based event reports/details
ALTER TABLE events ADD COLUMN IF NOT EXISTS content TEXT;

-- Simple slug generation for existing events
UPDATE events 
SET slug = LOWER(REPLACE(title, ' ', '-')) || '-' || SUBSTR(id::text, 1, 4)
WHERE slug IS NULL;

-- Set image_url as the first element of images if images is empty but image_url exists
UPDATE events
SET images = ARRAY[image_url]
WHERE (images IS NULL OR array_length(images, 1) IS NULL) AND image_url IS NOT NULL;

-- Migration v4.1: Visibility Toggle
-- Run this in your Supabase SQL Editor

-- Add is_visible to all relevant tables if it doesn't exist
ALTER TABLE socials ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Update existing records
UPDATE socials SET is_visible = true WHERE is_visible IS NULL;
UPDATE blogs SET is_visible = true WHERE is_visible IS NULL;
UPDATE skills SET is_visible = true WHERE is_visible IS NULL;
UPDATE experiences SET is_visible = true WHERE is_visible IS NULL;
UPDATE projects SET is_visible = true WHERE is_visible IS NULL;
UPDATE certifications SET is_visible = true WHERE is_visible IS NULL;
UPDATE events SET is_visible = true WHERE is_visible IS NULL;

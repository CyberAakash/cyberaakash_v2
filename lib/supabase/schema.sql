-- ============================================
-- CyberAakash Portfolio Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLES
-- ==========================================

-- About/profile info (single row)
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Aakash T',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  tagline TEXT DEFAULT 'Code. Build. Ship.',
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  location TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills with categories
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT,
  proficiency INT DEFAULT 80,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Work experience
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  type TEXT DEFAULT 'full-time',
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'web',
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blogs
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

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  badge_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events / activities
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  type TEXT DEFAULT 'achievement',
  link_url TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Site config (key-value)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public read access (anon can read visible items)
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (is_published = true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Auth manage about" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- SEED DATA
-- ==========================================

-- About
INSERT INTO about (name, title, tagline, bio, github_url, linkedin_url, email, location)
VALUES (
  'Aakash T',
  'Full Stack Developer',
  'Code. Build. Ship.',
  'Full Stack Developer at Zoho. I build things that live on the internet. My daily loop: code → play → gym → learn → think → sleep. On a mission to build something of my own — entrepreneur in the making.',
  'https://github.com/cyberaakash',
  'https://linkedin.com/in/cyberaakash',
  'cyberaakash@email.com',
  'Tamil Nadu, India'
);

-- Skills
INSERT INTO skills (name, category, display_order) VALUES
  ('Next.js', 'frontend', 1),
  ('React', 'frontend', 2),
  ('TypeScript', 'frontend', 3),
  ('Tailwind CSS', 'frontend', 4),
  ('Angular', 'frontend', 5),
  ('Framer Motion', 'frontend', 6),
  ('Vite', 'frontend', 7),
  ('RxJS', 'frontend', 8),
  ('Java', 'backend', 1),
  ('Spring Boot', 'backend', 2),
  ('Node.js', 'backend', 3),
  ('MySQL', 'backend', 4),
  ('Redis', 'backend', 5),
  ('JPA', 'backend', 6),
  ('REST APIs', 'backend', 7),
  ('Linux', 'backend', 8),
  ('Solidity', 'web3', 1),
  ('Ethereum', 'web3', 2),
  ('Web3.js', 'web3', 3),
  ('Smart Contracts', 'web3', 4),
  ('Firebase', 'tools', 1),
  ('Supabase', 'tools', 2),
  ('Git', 'tools', 3),
  ('Postman', 'tools', 4),
  ('Docker', 'tools', 5),
  ('Figma', 'tools', 6);

-- Experiences
INSERT INTO experiences (role, company, type, start_date, end_date, description, tech_stack, display_order) VALUES
  ('Member of Technical Staff', 'Zoho', 'full-time', '2024-08-01', NULL, 'Building enterprise-grade products at scale. Working across the full stack to ship features that serve millions of users.', ARRAY['Java', 'Spring Boot', 'Angular', 'MySQL', 'Redis'], 1),
  ('Software Developer Trainee', 'FinSurge', 'internship', '2024-01-01', '2024-08-01', 'Developed fintech solutions and gained hands-on experience with modern web technologies and payment systems.', ARRAY['React', 'Node.js', 'TypeScript'], 2),
  ('Freelance Web Developer', 'Self-Employed', 'freelance', '2023-02-01', '2023-11-01', 'Built full-stack applications for clients including Syncasphere (remote worker management), Mannit.co (PWA with location tracking), and SMA (digital attendance system).', ARRAY['Next.js', 'React', 'Tailwind CSS', 'Firebase', 'Leaflet.js'], 3);

-- Projects
INSERT INTO projects (title, description, tech_stack, category, is_featured, display_order) VALUES
  ('Syncasphere', 'Full-stack application for managing remote workers with real-time collaboration features.', ARRAY['Next.js', 'Tailwind CSS', 'Firebase'], 'fullstack', true, 1),
  ('CyberSpacia', 'Instagram clone with full social media functionality — posts, stories, and real-time messaging.', ARRAY['Next.js', 'Tailwind CSS', 'Firebase', 'NextAuth'], 'fullstack', true, 2),
  ('Banking Application', 'Secure banking system with transaction management, account operations, and authentication.', ARRAY['Java', 'Spring Boot', 'JPA', 'MySQL'], 'backend', true, 3),
  ('Socialised Crime Reporting DApp', 'Blockchain-based crime reporting portal built during Unfold 2023 Hackathon.', ARRAY['Solidity', 'Ethereum', 'Web3.js', 'React'], 'web3', true, 4),
  ('Mannit.co', 'Progressive web app with real-time location tracking and route optimization.', ARRAY['React', 'Leaflet.js', 'PWA'], 'web', false, 5),
  ('SMA', 'Digital attendance and syllabus tracking system for educational institutions.', ARRAY['React', 'Firebase'], 'web', false, 6);

-- Certifications
INSERT INTO certifications (title, issuer, display_order) VALUES
  ('Certified in Cybersecurity (CC)', '(ISC)²', 1),
  ('Red Hat Certified System Administrator (RHCSA)', 'Red Hat', 2),
  ('Network Essentials', 'Cisco', 3),
  ('Web Development & Designing', 'The Sparks Foundation', 4);

-- Events
INSERT INTO events (title, description, event_date, type) VALUES
  ('Unfold 2023 Hackathon', 'Built a blockchain-based crime reporting DApp. First exposure to Web3 development in a competitive environment.', '2023-10-15', 'hackathon'),
  ('Google Developer Student Club', 'Active member for 2+ years. Participated in workshops, study jams, and community events.', '2021-08-01', 'community'),
  ('Joined Zoho as MTS', 'Started full-time role as Member of Technical Staff at Zoho Corporation.', '2024-08-01', 'achievement'),
  ('RHCSA Certification', 'Passed the Red Hat Certified System Administrator exam.', '2023-06-01', 'achievement');

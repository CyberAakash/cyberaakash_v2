-- =====================================
-- CyberAakash v3.2 — Dummy Data & Storage Setup
-- Run this in Supabase SQL Editor
-- =====================================

-- 1. Experience Table Type Change (Bullet Points)
DO $$
BEGIN
  -- Check if description is already TEXT[]
  IF (SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'experiences' AND column_name = 'description') = 'text' THEN
    
    -- Alter column to TEXT[]
    ALTER TABLE experiences 
    ALTER COLUMN description TYPE TEXT[] 
    USING CASE 
      WHEN description IS NULL THEN '{}'::TEXT[]
      ELSE ARRAY[description] 
    END;
  END IF;
END $$;

-- 2. Dummy Blog Data
INSERT INTO blogs (title, slug, excerpt, content, tags, is_published, published_at)
VALUES 
(
  'Building My Vision: The Journey of CyberAakash', 
  'journey-of-cyberaakash', 
  'A deep dive into why I started building my portfolio and what I hope to achieve with it.', 
  'The journey of building CyberAakash started as a simple desire to showcase my work. Over time, it evolved into a platform where I could experiment with the latest web technologies and share my thoughts on the industry.

In this post, I talk about the challenges of balancing a full-time job at Zoho with my passion for side projects, and how I use this site as a digital laboratory for my ideas.', 
  ARRAY['nextjs', 'career', 'evolution'], 
  true, 
  now()
),
(
  'Exploring the Web3 Frontier', 
  'exploring-web3-frontier', 
  'My insights into the world of blockchain, smart contracts, and decentralized applications.', 
  'Web3 is more than just a buzzword; it is a paradigm shift in how we think about data and ownership. Having built a blockchain-based crime reporting DApp, I have seen firsthand the potential of Solidity and Ethereum.

This post explores the technical hurdles of Web3 development and why every developer should keep an eye on this space.', 
  ARRAY['web3', 'solidity', 'blockchain'], 
  true, 
  now()
),
(
  'Mastering Clean Architecture in Next.js', 
  'mastering-clean-architecture-nextjs', 
  'How to structure large-scale Next.js applications for maintainability and scalability.', 
  'As applications grow, the need for a solid architecture becomes paramount. Clean Architecture provides a way to separate concerns and make your code more testable.

I share my experience implementing these patterns in modern React environments, focusing on the App Router and Supabase integration.', 
  ARRAY['nextjs', 'architecture', 'best-practices'], 
  true, 
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Storage Bucket Setup
-- NOTE: You must also create the bucket manually in the Supabase Dashboard UI if not already done.
-- The name should be 'project-images' and 'blog-images'.

-- This SQL just ensures the public policies exist if you've created the buckets.
-- It works if you have the storage extension enabled.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public reading
CREATE POLICY "Public Read project-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'project-images');
CREATE POLICY "Public Read blog-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'blog-images');

-- Policies for authenticated upload
CREATE POLICY "Auth Upload project-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Auth Upload blog-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images');

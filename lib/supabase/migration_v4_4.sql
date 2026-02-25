-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Select policy (public)
DROP POLICY IF EXISTS "Public Read Access" ON public.gallery;
CREATE POLICY "Public Read Access" 
ON public.gallery FOR SELECT 
USING (true);

-- Admin policy (all access for authenticated users)
DROP POLICY IF EXISTS "Admin CRUD Access" ON public.gallery;
CREATE POLICY "Admin CRUD Access" 
ON public.gallery FOR ALL 
USING (auth.role() = 'authenticated');

-- Run this in the Supabase SQL Editor to fix the crops and crop_categories RLS error

-- Enable RLS on both tables
ALTER TABLE public.crop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- 1. Drop existing policies just in case
DROP POLICY IF EXISTS "Anyone can view categories" ON public.crop_categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.crop_categories;
DROP POLICY IF EXISTS "Anyone can view crops" ON public.crops;
DROP POLICY IF EXISTS "Authenticated users can insert crops" ON public.crops;

-- 2. Allow everyone to SELECT
CREATE POLICY "Anyone can view categories" 
ON public.crop_categories FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view crops" 
ON public.crops FOR SELECT 
USING (true);

-- 3. Allow any authenticated user (farmers) to INSERT new crops and categories
CREATE POLICY "Authenticated users can insert categories" 
ON public.crop_categories FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can insert crops" 
ON public.crops FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Run this in the Supabase SQL Editor to fix the crop_listings RLS error

ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;

-- 1. Drop existing policies just in case
DROP POLICY IF EXISTS "Listings are viewable by everyone." ON public.crop_listings;
DROP POLICY IF EXISTS "Farmers can insert their own listings." ON public.crop_listings;
DROP POLICY IF EXISTS "Farmers can update own listings." ON public.crop_listings;

-- 2. Allow everyone to view active listings
CREATE POLICY "Listings are viewable by everyone." 
ON public.crop_listings FOR SELECT 
USING (true);

-- 3. Allow farmers to insert their own listings
CREATE POLICY "Farmers can insert their own listings." 
ON public.crop_listings FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = farmer_id);

-- 4. Allow farmers to update their own listings
CREATE POLICY "Farmers can update own listings." 
ON public.crop_listings FOR UPDATE 
TO authenticated
USING (auth.uid() = farmer_id);

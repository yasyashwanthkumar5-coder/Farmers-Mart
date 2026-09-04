-- Run this script in your Supabase SQL Editor to grant Admins the necessary permissions and fix Profile visibility

-- 1. Profiles Visibility
-- Buyers need to see Farmer locations, Farmers need to see Buyer names, and Admins need to see everything.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated USING (true);


-- 2. Admin Permissions for Purchase Requests
DROP POLICY IF EXISTS "Admins can view all purchase requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Admins can update all purchase requests" ON public.purchase_requests;

CREATE POLICY "Admins can view all purchase requests" 
ON public.purchase_requests FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all purchase requests" 
ON public.purchase_requests FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 3. Admin Permissions for Orders
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

CREATE POLICY "Admins can insert orders" 
ON public.orders FOR INSERT 
TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all orders" 
ON public.orders FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 4. Admin Permissions for Crop Listings (Admins need to deduct quantity when approving an order)
DROP POLICY IF EXISTS "Admins can update all crop listings" ON public.crop_listings;

CREATE POLICY "Admins can update all crop listings" 
ON public.crop_listings FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==========================================
-- SUPER IMPORTANT: RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

-- 1. Enable RLS on Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (so buyers can see farmer details and vice versa)
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

-- Allow authenticated users to insert their own profile during registration
CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Enable RLS on Crop Listings
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active listings
CREATE POLICY "Listings are viewable by everyone." 
ON crop_listings FOR SELECT USING (true);

-- Allow farmers to insert their own listings
CREATE POLICY "Farmers can insert their own listings." 
ON crop_listings FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

-- Allow farmers to update their own listings
CREATE POLICY "Farmers can update own listings." 
ON crop_listings FOR UPDATE 
USING (auth.uid() = farmer_id);

-- 3. Enable RLS on Purchase Requests
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own requests, Farmers can see requests for their listings, Admins see all
CREATE POLICY "Users can view their own requests." 
ON purchase_requests FOR SELECT 
USING (
  auth.uid() = buyer_id 
  OR 
  auth.uid() IN (SELECT farmer_id FROM crop_listings WHERE id = listing_id)
  OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Buyers can insert purchase requests
CREATE POLICY "Buyers can insert requests." 
ON purchase_requests FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- Admins can update purchase requests (to approve/reject)
CREATE POLICY "Admins can update requests." 
ON purchase_requests FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. Enable RLS on Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can see their own orders, Admins can see all
CREATE POLICY "Users can view their own orders." 
ON orders FOR SELECT 
USING (
  auth.uid() = buyer_id 
  OR 
  auth.uid() = farmer_id
  OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Only Admins can create and update orders
CREATE POLICY "Admins can insert orders." 
ON orders FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update orders." 
ON orders FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

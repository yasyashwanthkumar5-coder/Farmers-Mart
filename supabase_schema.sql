-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM (Idempotent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) UNIQUE NOT NULL,
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_verified BOOLEAN DEFAULT false
);

-- CROP CATEGORIES
CREATE TABLE IF NOT EXISTS crop_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT
);

-- CROPS (Master list)
CREATE TABLE IF NOT EXISTS crops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES crop_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    default_unit VARCHAR(20) DEFAULT 'kg'
);

-- CROP LISTINGS (Created by Farmer)
CREATE TABLE IF NOT EXISTS crop_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    asking_price DECIMAL(10,2) NOT NULL,
    harvest_date DATE,
    farming_method VARCHAR(50), -- Organic/Conventional
    description TEXT,
    images JSONB, -- Array of image URLs
    ai_quality_score INTEGER,
    ai_quality_grade VARCHAR(10),
    ai_assessment JSONB,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, sold_out
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MARKET PRICE DATA
CREATE TABLE IF NOT EXISTS market_price_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    lowest_price DECIMAL(10,2),
    average_price DECIMAL(10,2),
    highest_price DECIMAL(10,2),
    unit VARCHAR(20),
    source VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PURCHASE REQUESTS (From Buyer to Admin)
CREATE TABLE IF NOT EXISTS purchase_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES crop_listings(id) ON DELETE CASCADE,
    requested_quantity DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    preferred_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDERS (Approved by Admin)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES purchase_requests(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    farmer_id UUID REFERENCES profiles(id),
    buyer_id UUID REFERENCES profiles(id),
    listing_id UUID REFERENCES crop_listings(id),
    quantity DECIMAL(10,2) NOT NULL,
    produce_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, scheduled, picked_up, in_transit, delivered, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- COLD STORAGE
CREATE TABLE IF NOT EXISTS cold_storage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity VARCHAR(100),
    price_per_unit DECIMAL(10,2),
    contact_info TEXT,
    is_available BOOLEAN DEFAULT true
);

-- Row Level Security (RLS) configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Database Trigger for Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_role text;
BEGIN
  -- Extract role from raw_user_meta_data
  selected_role := NEW.raw_user_meta_data->>'role';

  -- Strict validation to prevent admin escalation
  IF selected_role NOT IN ('farmer', 'buyer') THEN
    selected_role := 'buyer';
  END IF;

  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    mobile_number,
    village,
    district,
    state,
    pincode
  )
  VALUES (
    NEW.id,
    selected_role::user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', 'temp-' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'village',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'pincode'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users that have no profile
INSERT INTO public.profiles (id, role, full_name, mobile_number, village, district, state, pincode)
SELECT 
    au.id,
    CASE 
      WHEN au.raw_user_meta_data->>'role' = 'farmer' THEN 'farmer'::user_role
      ELSE 'buyer'::user_role
    END as role,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Migrated User'),
    COALESCE(au.raw_user_meta_data->>'mobile_number', 'm-' || substr(au.id::text, 1, 8)),
    au.raw_user_meta_data->>'village',
    au.raw_user_meta_data->>'district',
    au.raw_user_meta_data->>'state',
    au.raw_user_meta_data->>'pincode'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

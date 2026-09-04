-- ==========================================
-- SUPER IMPORTANT: RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

-- 1. Create the secure function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
BEGIN
  -- Strict role validation: Default to 'buyer' if invalid or missing
  IF NEW.raw_user_meta_data->>'role' = 'farmer' THEN
    v_role := 'farmer'::user_role;
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    -- Prevent unauthorized admin registration via public sign-up
    v_role := 'buyer'::user_role;
  ELSE
    v_role := 'buyer'::user_role;
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
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', '0000000000'),
    NEW.raw_user_meta_data->>'village',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'pincode'
  );

  RETURN NEW;
END;
$$;

-- 2. Drop trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- BACKFILL MISSING PROFILES
-- ==========================================
-- This query finds all users in auth.users that DO NOT have a row in public.profiles.
-- It attempts to use raw_user_meta_data if available, otherwise inserts generic fallbacks.

INSERT INTO public.profiles (id, role, full_name, mobile_number, village, district, state, pincode)
SELECT 
    au.id,
    CASE 
      WHEN au.raw_user_meta_data->>'role' = 'farmer' THEN 'farmer'::user_role
      ELSE 'buyer'::user_role
    END as role,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Migrated User ' || substr(au.id::text, 1, 6)),
    COALESCE(au.raw_user_meta_data->>'mobile_number', 'Migration-' || substr(au.id::text, 1, 6)),
    au.raw_user_meta_data->>'village',
    au.raw_user_meta_data->>'district',
    au.raw_user_meta_data->>'state',
    au.raw_user_meta_data->>'pincode'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- ==========================================
-- SUPER IMPORTANT: RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

-- STEP 1: FIX RLS POLICIES FOR PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any previous over-permissive policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- The authenticated user must be allowed to SELECT their own profile:
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);


-- STEP 2: CREATE THE PROFILE TRIGGER FUNCTION
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
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', '0000000000'),
    NEW.raw_user_meta_data->>'village',
    NEW.raw_user_meta_data->>'district',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'pincode'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;


-- STEP 3: CREATE THE TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- STEP 4: BACKFILL EXISTING USERS
-- Ensure existing auth users have a matching profile
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

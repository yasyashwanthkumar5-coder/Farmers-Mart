-- 1. Ensure RLS is enabled
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies just in case
DROP POLICY IF EXISTS "Buyers can insert purchase requests." ON public.purchase_requests;
DROP POLICY IF EXISTS "Buyers can view their own purchase requests." ON public.purchase_requests;
DROP POLICY IF EXISTS "Buyers can view their own orders." ON public.orders;

-- 3. Allow ANY authenticated user to insert a purchase request for themselves
CREATE POLICY "Users can insert their own purchase requests." 
ON public.purchase_requests FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

-- 4. Allow ANY authenticated user to view their own purchase requests
CREATE POLICY "Users can view their own purchase requests." 
ON public.purchase_requests FOR SELECT 
TO authenticated
USING (auth.uid() = buyer_id);

-- 5. Allow ANY authenticated user to view their own orders
CREATE POLICY "Users can view their own orders." 
ON public.orders FOR SELECT 
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = farmer_id);

-- Run this script in your Supabase SQL Editor to elevate the 5 new accounts to admin status
UPDATE public.profiles 
SET role = 'admin' 
WHERE mobile_number IN (
    '9000000001',
    '9000000002',
    '9000000003',
    '9000000004',
    '9000000005'
);

-- Row Level Security Policies for Kids Sports Zone
-- Run this in your Supabase SQL Editor to fix the 403 errors

-- ============================================
-- VENUES TABLE POLICIES
-- ============================================

-- Enable RLS on venues table
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view published venues" ON venues;
DROP POLICY IF EXISTS "Owners can view their own venues" ON venues;
DROP POLICY IF EXISTS "Owners can insert their own venues" ON venues;
DROP POLICY IF EXISTS "Owners can update their own venues" ON venues;
DROP POLICY IF EXISTS "Owners can delete their own venues" ON venues;

-- Policy: Anyone can view published venues
CREATE POLICY "Anyone can view published venues"
ON venues
FOR SELECT
USING (status = 'published');

-- Policy: Venue owners can view their own venues (any status)
CREATE POLICY "Owners can view their own venues"
ON venues
FOR SELECT
USING (auth.uid() = owner_id);

-- Policy: Venue owners can insert their own venues
CREATE POLICY "Owners can insert their own venues"
ON venues
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Policy: Venue owners can update their own venues
CREATE POLICY "Owners can update their own venues"
ON venues
FOR UPDATE
USING (auth.uid() = owner_id);

-- Policy: Venue owners can delete their own venues
CREATE POLICY "Owners can delete their own venues"
ON venues
FOR DELETE
USING (auth.uid() = owner_id);


-- ============================================
-- OFFERS TABLE POLICIES
-- ============================================

-- Enable RLS on offers table
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
DROP POLICY IF EXISTS "Owners can view their venue offers" ON offers;
DROP POLICY IF EXISTS "Owners can create venue offers" ON offers;
DROP POLICY IF EXISTS "Owners can update their venue offers" ON offers;
DROP POLICY IF EXISTS "Owners can delete their venue offers" ON offers;

-- Policy: Anyone can view active, non-expired offers
CREATE POLICY "Anyone can view active offers"
ON offers
FOR SELECT
USING (
  is_active = true
  AND expires_at > NOW()
);

-- Policy: Venue owners can view all their venue's offers
CREATE POLICY "Owners can view their venue offers"
ON offers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = offers.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Policy: Venue owners can create offers for their venues
CREATE POLICY "Owners can create venue offers"
ON offers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = offers.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Policy: Venue owners can update their venue's offers
CREATE POLICY "Owners can update their venue offers"
ON offers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = offers.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Policy: Venue owners can delete their venue's offers
CREATE POLICY "Owners can delete their venue offers"
ON offers
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = offers.venue_id
    AND venues.owner_id = auth.uid()
  )
);


-- ============================================
-- REVIEWS TABLE POLICIES
-- ============================================

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Policy: Anyone can view all reviews
CREATE POLICY "Anyone can view reviews"
ON reviews
FOR SELECT
USING (true);

-- Policy: Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
ON reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON reviews
FOR DELETE
USING (auth.uid() = user_id);


-- ============================================
-- FAVORITES TABLE POLICIES
-- ============================================

-- Enable RLS on favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON favorites;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
ON favorites
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can add favorites
CREATE POLICY "Users can add favorites"
ON favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove their favorites
CREATE POLICY "Users can remove favorites"
ON favorites
FOR DELETE
USING (auth.uid() = user_id);


-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Policy: Anyone can view basic profile info
CREATE POLICY "Anyone can view profiles"
ON profiles
FOR SELECT
USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy: Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);


-- ============================================
-- VERIFICATION
-- ============================================

-- Check all policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('venues', 'offers', 'reviews', 'favorites', 'profiles')
ORDER BY tablename, policyname;

-- ==================================================
-- Supabase Photo Storage Setup for Kids Sports Zone
-- ==================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ==================================================

-- Step 1: Create storage bucket for venue photos
-- This creates a public bucket where photos will be stored
INSERT INTO storage.buckets (id, name, public)
VALUES ('venue-photos', 'venue-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set up storage policies for public access and authenticated uploads

-- Allow public read access to all photos
CREATE POLICY "Public can view venue photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'venue-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload venue photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'venue-photos'
  AND (storage.foldername(name))[1] IN ('venues', 'temp')
);

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'venue-photos'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'venue-photos'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Step 3: Ensure venue_photos table exists with correct schema
CREATE TABLE IF NOT EXISTS venue_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_venue_photos_venue_id
ON venue_photos(venue_id);

CREATE INDEX IF NOT EXISTS idx_venue_photos_display_order
ON venue_photos(venue_id, display_order);

-- Create partial index for featured photos (only if is_featured column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'venue_photos' AND column_name = 'is_featured'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_venue_photos_featured
    ON venue_photos(venue_id, is_featured)
    WHERE is_featured = true;
  END IF;
END $$;

-- Step 5: Add RLS (Row Level Security) policies for venue_photos table

-- Enable RLS
ALTER TABLE venue_photos ENABLE ROW LEVEL SECURITY;

-- Public can view all venue photos
CREATE POLICY "Public can view venue photos"
ON venue_photos FOR SELECT
TO public
USING (true);

-- Authenticated users can insert photos for their own venues
CREATE POLICY "Users can insert photos for own venues"
ON venue_photos FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = venue_photos.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Authenticated users can update photos for their own venues
CREATE POLICY "Users can update photos for own venues"
ON venue_photos FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = venue_photos.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Authenticated users can delete photos for their own venues
CREATE POLICY "Users can delete photos for own venues"
ON venue_photos FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE venues.id = venue_photos.venue_id
    AND venues.owner_id = auth.uid()
  )
);

-- Admins can manage all photos
CREATE POLICY "Admins can manage all venue photos"
ON venue_photos FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Step 6: Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_venue_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER venue_photos_updated_at
BEFORE UPDATE ON venue_photos
FOR EACH ROW
EXECUTE FUNCTION update_venue_photos_updated_at();

-- ==================================================
-- Setup Complete!
-- ==================================================
-- You can now upload photos from the Add Venue page
--
-- Test by:
-- 1. Sign up as venue owner
-- 2. Go to /dashboard/venue/add
-- 3. Fill in venue details
-- 4. Upload photos in Step 5
-- 5. Submit venue
--
-- Check Supabase Storage dashboard to see uploaded files
-- ==================================================

-- Kids Sports Zone Database Schema
-- This file should be run in your Supabase SQL Editor

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'venue_owner', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LOCATION PAGES TABLE (for SEO content)
-- =============================================
CREATE TABLE location_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('state', 'city', 'suburb')),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  state_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_content TEXT,
  faqs JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(type, slug)
);

-- =============================================
-- VENUES TABLE
-- =============================================
CREATE TABLE venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Location
  address TEXT,
  suburb TEXT,
  city TEXT,
  city_slug TEXT,
  state_id TEXT,
  postcode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(POINT, 4326), -- PostGIS point for spatial queries

  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  facebook_url TEXT,
  instagram_url TEXT,

  -- Details
  facilities TEXT[],
  age_min INTEGER DEFAULT 1,
  age_max INTEGER DEFAULT 18,
  indoor BOOLEAN DEFAULT false,
  outdoor BOOLEAN DEFAULT false,
  price_range INTEGER CHECK (price_range IN (1, 2, 3)), -- $, $$, $$$

  -- Features
  featured_image TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pending', 'rejected')),
  claimed BOOLEAN DEFAULT false,
  owner_id UUID REFERENCES profiles(id),
  is_promoted BOOLEAN DEFAULT false,
  promoted_until TIMESTAMPTZ,

  -- Metadata
  scraped_from TEXT,
  google_place_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index for location-based queries
CREATE INDEX idx_venues_location ON venues USING GIST(location);
CREATE INDEX idx_venues_city_slug ON venues(city_slug);
CREATE INDEX idx_venues_state_id ON venues(state_id);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_promoted ON venues(is_promoted, promoted_until);

-- =============================================
-- VENUE CATEGORIES (many-to-many)
-- =============================================
CREATE TABLE venue_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, category_id)
);

CREATE INDEX idx_venue_categories_venue ON venue_categories(venue_id);
CREATE INDEX idx_venue_categories_category ON venue_categories(category_id);

-- =============================================
-- VENUE PHOTOS TABLE
-- =============================================
CREATE TABLE venue_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_venue_photos_venue ON venue_photos(venue_id);

-- =============================================
-- OFFERS TABLE
-- =============================================
CREATE TABLE offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_text TEXT, -- e.g., "10% off", "First class free"
  terms TEXT,

  -- Promotion
  is_active BOOLEAN DEFAULT true,
  is_promoted BOOLEAN DEFAULT false,

  -- Validity
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_venue ON offers(venue_id);
CREATE INDEX idx_offers_active ON offers(is_active, expires_at);
CREATE INDEX idx_offers_promoted ON offers(is_promoted);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, user_id) -- One review per user per venue
);

CREATE INDEX idx_reviews_venue ON reviews(venue_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, venue_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_venue ON favorites(venue_id);

-- =============================================
-- VENUE CLAIMS TABLE
-- =============================================
CREATE TABLE venue_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_claims_venue ON venue_claims(venue_id);
CREATE INDEX idx_claims_user ON venue_claims(user_id);
CREATE INDEX idx_claims_status ON venue_claims(status);

-- =============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REPORTED ISSUES TABLE
-- =============================================
CREATE TABLE reported_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  reporter_email TEXT,
  issue_type TEXT CHECK (issue_type IN ('outdated', 'incorrect', 'closed', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update venue's average rating
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE venues
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)
    )
  WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating venue rating
CREATE TRIGGER trigger_update_venue_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_venue_rating();

-- Function to update location from lat/lng
CREATE OR REPLACE FUNCTION update_venue_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating venue location
CREATE TRIGGER trigger_update_venue_location
BEFORE INSERT OR UPDATE ON venues
FOR EACH ROW
EXECUTE FUNCTION update_venue_location();

-- Function to find nearby venues
CREATE OR REPLACE FUNCTION nearby_venues(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 10,
  category_filter UUID DEFAULT NULL,
  age_min_filter INTEGER DEFAULT NULL,
  age_max_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.name,
    v.slug,
    ROUND(ST_Distance(
      v.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    )::DECIMAL / 1000, 2) as distance_km
  FROM venues v
  WHERE
    v.status = 'published'
    AND ST_DWithin(
      v.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
    AND (category_filter IS NULL OR EXISTS (
      SELECT 1 FROM venue_categories vc
      WHERE vc.venue_id = v.id AND vc.category_id = category_filter
    ))
    AND (age_min_filter IS NULL OR v.age_max >= age_min_filter)
    AND (age_max_filter IS NULL OR v.age_min <= age_max_filter)
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_issues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Venues policies
CREATE POLICY "Published venues are viewable by everyone"
  ON venues FOR SELECT
  USING (status = 'published' OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Venue owners can update their venues"
  ON venues FOR UPDATE
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Anyone can create venues"
  ON venues FOR INSERT
  WITH CHECK (true);

-- Venue categories policies
CREATE POLICY "Venue categories are viewable by everyone"
  ON venue_categories FOR SELECT
  USING (true);

-- Venue photos policies
CREATE POLICY "Venue photos are viewable by everyone"
  ON venue_photos FOR SELECT
  USING (true);

CREATE POLICY "Venue owners can manage photos"
  ON venue_photos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

-- Offers policies
CREATE POLICY "Active offers are viewable by everyone"
  ON offers FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

CREATE POLICY "Venue owners can manage offers"
  ON offers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id AND (owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- Venue claims policies
CREATE POLICY "Users can view own claims"
  ON venue_claims FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can create claims"
  ON venue_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update claims"
  ON venue_claims FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Location pages policies
CREATE POLICY "Location pages are viewable by everyone"
  ON location_pages FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage location pages"
  ON location_pages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Reported issues policies
CREATE POLICY "Anyone can report issues"
  ON reported_issues FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage reports"
  ON reported_issues FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- =============================================
-- SEED DATA - Categories
-- =============================================
INSERT INTO categories (name, slug, description, icon, color, popular) VALUES
('Swimming', 'swimming', 'Swimming lessons and aquatic activities for kids', '🏊', '#42ad8b', true),
('Soccer', 'soccer', 'Football clubs and training programs', '⚽', '#f5ab38', true),
('Dance', 'dance', 'Dance classes including ballet, hip-hop, jazz and more', '💃', '#f549a4', true),
('Martial Arts', 'martial-arts', 'Karate, Taekwondo, Judo and other martial arts', '🥋', '#ee7924', true),
('Gymnastics', 'gymnastics', 'Gymnastics programs and tumbling classes', '🤸', '#f39c32', true),
('Tennis', 'tennis', 'Tennis lessons and junior programs', '🎾', '#338e78', true),
('Basketball', 'basketball', 'Basketball training and junior leagues', '🏀', '#ee2176', false),
('Netball', 'netball', 'Netball clubs and training programs', '🏐', '#f768b2', false),
('Cricket', 'cricket', 'Cricket coaching and junior teams', '🏏', '#3c9f83', false),
('Rugby', 'rugby', 'Rugby league and union for juniors', '🏉', '#2b7e6e', false),
('AFL', 'afl', 'Australian Football League junior programs', '🏈', '#eb5a17', true),
('Athletics', 'athletics', 'Track and field programs for kids', '🏃', '#f08a2b', false),
('Horse Riding', 'horse-riding', 'Equestrian lessons and pony clubs', '🏇', '#7ac6ae', false),
('Skateboarding', 'skateboarding', 'Skateboard lessons and skate parks', '🛹', '#f7b956', false),
('Surfing', 'surfing', 'Surf schools and ocean safety programs', '🏄', '#42ad8b', false),
('Rock Climbing', 'rock-climbing', 'Indoor and outdoor climbing for kids', '🧗', '#f23992', false),
('Yoga', 'yoga', 'Kids yoga and mindfulness classes', '🧘', '#5eb99c', false),
('Music', 'music', 'Music lessons and instrumental training', '🎵', '#fbb0d3', false),
('Drama', 'drama', 'Acting classes and theatre programs', '🎭', '#f987c0', false),
('Art', 'art', 'Art classes and creative workshops', '🎨', '#fde8c4', false),
('Coding', 'coding', 'Programming and robotics classes', '💻', '#a0d6c5', false),
('Chess', 'chess', 'Chess coaching and tournaments', '♟️', '#1d6159', false),
('Cycling', 'cycling', 'Bike riding skills and BMX programs', '🚴', '#f9c774', false),
('Golf', 'golf', 'Junior golf lessons and programs', '⛳', '#338e78', false),
('Sailing', 'sailing', 'Sailing clubs and junior programs', '⛵', '#42ad8b', false),
('Hockey', 'hockey', 'Field hockey and ice hockey', '🏑', '#2b7e6e', false),
('Baseball', 'baseball', 'T-ball and baseball leagues', '⚾', '#ee7924', false),
('Volleyball', 'volleyball', 'Volleyball training and junior teams', '🏐', '#f549a4', false),
('Squash', 'squash', 'Squash lessons and junior competitions', '🎾', '#f5ab38', false),
('Badminton', 'badminton', 'Badminton coaching and clubs', '🏸', '#f08a2b', false);

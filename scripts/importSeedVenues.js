/**
 * Import Seed Venues to Supabase
 *
 * This script imports the 20 real Australian sports venues from seed-venues.json
 * Run: node scripts/importSeedVenues.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importSeedVenues() {
  console.log('🌱 Importing seed venues...\n');

  // Read seed venues
  const seedPath = path.join(__dirname, '..', 'seed-venues.json');

  if (!fs.existsSync(seedPath)) {
    console.error('❌ seed-venues.json not found!');
    process.exit(1);
  }

  const venues = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  console.log(`📄 Found ${venues.length} venues to import\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const venue of venues) {
    try {
      // Check if venue already exists by slug
      const { data: existing } = await supabase
        .from('venues')
        .select('id, slug')
        .eq('slug', venue.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping "${venue.name}" - already exists`);
        skipped++;
        continue;
      }

      // Prepare venue data
      const venueData = {
        name: venue.name,
        slug: venue.slug,
        description: venue.description,
        address: venue.address,
        suburb: venue.suburb,
        city: venue.city,
        city_slug: venue.city_slug,
        state_id: venue.state_id,
        state: venue.state,
        postcode: venue.postcode,
        latitude: venue.latitude,
        longitude: venue.longitude,
        phone: venue.phone,
        email: venue.email,
        website: venue.website,
        status: venue.status,
        facilities: venue.facilities,
        opening_hours: venue.opening_hours,
        price_range: venue.price_range,
        age_range_min: venue.age_range_min,
        age_range_max: venue.age_range_max,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert venue
      const { data: newVenue, error: venueError } = await supabase
        .from('venues')
        .insert([venueData])
        .select()
        .single();

      if (venueError) {
        console.error(`❌ Error inserting "${venue.name}":`, venueError.message);
        errors++;
        continue;
      }

      // Insert venue categories
      if (venue.category_ids && venue.category_ids.length > 0) {
        const categoryLinks = venue.category_ids.map(categoryId => ({
          venue_id: newVenue.id,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('venue_categories')
          .insert(categoryLinks);

        if (categoryError) {
          console.error(`⚠️  Warning: Could not link categories for "${venue.name}":`, categoryError.message);
        }
      }

      console.log(`✅ Imported "${venue.name}" (${venue.city}, ${venue.state})`);
      imported++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Unexpected error with "${venue.name}":`, error.message);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📝 Total processed: ${venues.length}`);
  console.log('='.repeat(50));

  if (imported > 0) {
    console.log('\n🎉 Seed venues imported successfully!');
    console.log('Visit your site to see the new venues.');
  }
}

// Run import
importSeedVenues().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

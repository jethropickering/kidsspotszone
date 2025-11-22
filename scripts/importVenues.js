/**
 * Import Generated Venues into Supabase
 *
 * This script reads the generated venue data and imports it into Supabase
 * using the Supabase client.
 *
 * Prerequisites:
 * 1. Run: node scripts/generateVenueData.js
 * 2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 * 3. Run: node scripts/importVenues.js
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
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read venue data
const venueDataPath = path.join(__dirname, '..', 'venue-data.json');

if (!fs.existsSync(venueDataPath)) {
  console.error('❌ venue-data.json not found!');
  console.error('Run: node scripts/generateVenueData.js first');
  process.exit(1);
}

const venues = JSON.parse(fs.readFileSync(venueDataPath, 'utf8'));

console.log(`📦 Loaded ${venues.length} venues from venue-data.json`);

// Import venues in batches
async function importVenues() {
  const BATCH_SIZE = 50; // Import 50 at a time
  let imported = 0;
  let errors = 0;

  console.log(`\n🚀 Starting import...`);

  for (let i = 0; i < venues.length; i += BATCH_SIZE) {
    const batch = venues.slice(i, i + BATCH_SIZE);

    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(venues.length / BATCH_SIZE)}: Importing venues ${i + 1}-${Math.min(i + BATCH_SIZE, venues.length)}...`);

    try {
      const { data, error } = await supabase
        .from('venues')
        .insert(batch.map(v => ({
          ...v,
          id: undefined, // Let Supabase generate IDs
        })));

      if (error) {
        console.error(`❌ Error in batch:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`✅ Imported ${batch.length} venues`);
      }
    } catch (err) {
      console.error(`❌ Batch failed:`, err.message);
      errors += batch.length;
    }

    // Rate limiting: wait 1 second between batches
    if (i + BATCH_SIZE < venues.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Import Summary:`);
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Successfully imported: ${imported} venues`);
  console.log(`❌ Errors: ${errors} venues`);
  console.log(`📈 Success rate: ${((imported / venues.length) * 100).toFixed(1)}%`);
  console.log(`${'='.repeat(50)}`);

  if (imported > 0) {
    console.log(`\n🎉 Import complete!`);
    console.log(`Visit your Supabase dashboard to view the venues.`);
  }
}

// Run import
importVenues().catch(console.error);

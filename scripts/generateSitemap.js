/**
 * Generate Sitemap for Kids Sports Zone
 *
 * This script generates a sitemap.xml file with all pages, venues, categories, and locations.
 * Run: node scripts/generateSitemap.js
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
const siteUrl = process.env.VITE_SITE_URL || 'https://kidsspotszone.com.au';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Categories
const categories = [
  { slug: 'swimming', name: 'Swimming' },
  { slug: 'football', name: 'Football' },
  { slug: 'tennis', name: 'Tennis' },
  { slug: 'basketball', name: 'Basketball' },
  { slug: 'gymnastics', name: 'Gymnastics' },
  { slug: 'dance', name: 'Dance' },
  { slug: 'martial-arts', name: 'Martial Arts' },
  { slug: 'athletics', name: 'Athletics' }
];

// States
const states = [
  { id: 'nsw', slug: 'nsw', name: 'New South Wales' },
  { id: 'vic', slug: 'vic', name: 'Victoria' },
  { id: 'qld', slug: 'qld', name: 'Queensland' },
  { id: 'wa', slug: 'wa', name: 'Western Australia' },
  { id: 'sa', slug: 'sa', name: 'South Australia' },
  { id: 'tas', slug: 'tas', name: 'Tasmania' },
  { id: 'act', slug: 'act', name: 'ACT' },
  { id: 'nt', slug: 'nt', name: 'Northern Territory' }
];

// Popular cities
const cities = [
  { slug: 'sydney', state: 'NSW' },
  { slug: 'melbourne', state: 'VIC' },
  { slug: 'brisbane', state: 'QLD' },
  { slug: 'perth', state: 'WA' },
  { slug: 'adelaide', state: 'SA' },
  { slug: 'gold-coast', state: 'QLD' },
  { slug: 'canberra', state: 'ACT' },
  { slug: 'newcastle', state: 'NSW' }
];

function generateSitemapXML(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...\n');

  const urls = [];
  const now = new Date().toISOString().split('T')[0];

  // 1. Static pages
  console.log('Adding static pages...');
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/search', priority: 0.9, changefreq: 'daily' },
    { path: '/about', priority: 0.6, changefreq: 'monthly' },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' },
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' }
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${siteUrl}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // 2. Category pages
  console.log('Adding category pages...');
  categories.forEach(category => {
    urls.push({
      loc: `${siteUrl}/${category.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // 3. State pages
  console.log('Adding state pages...');
  states.forEach(state => {
    urls.push({
      loc: `${siteUrl}/locations/${state.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // 4. City pages
  console.log('Adding city pages...');
  cities.forEach(city => {
    urls.push({
      loc: `${siteUrl}/locations/${city.state.toLowerCase()}/${city.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // 5. State + Category pages
  console.log('Adding state + category pages...');
  states.forEach(state => {
    categories.forEach(category => {
      urls.push({
        loc: `${siteUrl}/${state.slug}/${category.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  });

  // 6. City + Category pages
  console.log('Adding city + category pages...');
  cities.forEach(city => {
    categories.forEach(category => {
      urls.push({
        loc: `${siteUrl}/${city.state.toLowerCase()}/${city.slug}/${category.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  });

  // 7. Venue pages (from database)
  console.log('Fetching published venues from database...');
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (error) throw error;

    console.log(`Adding ${venues.length} venue pages...`);
    venues.forEach(venue => {
      urls.push({
        loc: `${siteUrl}/venue/${venue.slug}`,
        lastmod: venue.updated_at ? venue.updated_at.split('T')[0] : now,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    console.log('Continuing without venue pages...');
  }

  // Generate XML
  console.log(`\n📄 Generating sitemap with ${urls.length} URLs...`);
  const sitemapXML = generateSitemapXML(urls);

  // Write to file
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXML);

  console.log(`\n✅ Sitemap generated successfully!`);
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);

  // Generate breakdown
  const breakdown = {
    'Static pages': staticPages.length,
    'Category pages': categories.length,
    'State pages': states.length,
    'City pages': cities.length,
    'State + Category': states.length * categories.length,
    'City + Category': cities.length * categories.length,
    'Venue pages': urls.filter(u => u.loc.includes('/venue/')).length
  };

  console.log('\n📈 Breakdown:');
  Object.entries(breakdown).forEach(([key, count]) => {
    console.log(`   ${key}: ${count}`);
  });

  console.log('\n🎉 Done!');
  console.log(`Upload sitemap.xml to ${siteUrl}/sitemap.xml`);
}

// Run sitemap generation
generateSitemap().catch(console.error);

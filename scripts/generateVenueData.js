/**
 * Generate Realistic Australian Sports Venue Data
 *
 * This script generates 500+ realistic venue records for Kids Sports Zone
 * with proper Australian addresses, phone numbers, and details.
 *
 * Run with: node scripts/generateVenueData.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Australian cities with coordinates
const cities = [
  { name: 'Sydney', state: 'NSW', state_id: 'nsw', lat: -33.8688, lon: 151.2093, suburbs: ['Bondi', 'Manly', 'Parramatta', 'Chatswood', 'Penrith', 'Liverpool', 'Bankstown', 'Hornsby', 'Cronulla', 'Neutral Bay'] },
  { name: 'Melbourne', state: 'VIC', state_id: 'vic', lat: -37.8136, lon: 144.9631, suburbs: ['Carlton', 'St Kilda', 'Richmond', 'Fitzroy', 'Brunswick', 'Glen Waverley', 'Doncaster', 'Box Hill', 'Moorabbin', 'Frankston'] },
  { name: 'Brisbane', state: 'QLD', state_id: 'qld', lat: -27.4698, lon: 153.0251, suburbs: ['Fortitude Valley', 'South Bank', 'Newstead', 'Kangaroo Point', 'West End', 'Chermside', 'Carindale', 'Indooroopilly', 'Toowong', 'Sunnybank'] },
  { name: 'Perth', state: 'WA', state_id: 'wa', lat: -31.9505, lon: 115.8605, suburbs: ['Fremantle', 'Subiaco', 'Northbridge', 'Cottesloe', 'Scarborough', 'Joondalup', 'Cannington', 'Morley', 'Midland', 'Rockingham'] },
  { name: 'Adelaide', state: 'SA', state_id: 'sa', lat: -34.9285, lon: 138.6007, suburbs: ['Glenelg', 'North Adelaide', 'Unley', 'Norwood', 'Brighton', 'Marion', 'Modbury', 'Tea Tree Gully', 'Elizabeth', 'Port Adelaide'] },
  { name: 'Gold Coast', state: 'QLD', state_id: 'qld', lat: -28.0167, lon: 153.4000, suburbs: ['Surfers Paradise', 'Broadbeach', 'Burleigh Heads', 'Southport', 'Robina', 'Varsity Lakes', 'Palm Beach', 'Coolangatta', 'Mermaid Beach', 'Miami'] },
  { name: 'Canberra', state: 'ACT', state_id: 'act', lat: -35.2809, lon: 149.1300, suburbs: ['Civic', 'Belconnen', 'Woden', 'Tuggeranong', 'Gungahlin', 'Dickson', 'Braddon', 'Kingston', 'Manuka', 'Fyshwick'] },
  { name: 'Newcastle', state: 'NSW', state_id: 'nsw', lat: -32.9283, lon: 151.7817, suburbs: ['The Junction', 'Merewether', 'Charlestown', 'Kotara', 'Warners Bay', 'Adamstown', 'Hamilton', 'Mayfield', 'Wallsend', 'Belmont'] },
];

// Venue name templates by category
const venueNames = {
  swimming: [
    '{suburb} Swim School',
    '{suburb} Aquatic Centre',
    '{suburb} Swimming Academy',
    '{city} Swim Centre',
    'Splash {suburb}',
    '{suburb} Learn to Swim',
    'AquaKids {suburb}',
    '{suburb} Pool & Leisure',
  ],
  football: [
    '{suburb} Soccer Club',
    '{suburb} Football Academy',
    '{city} FC Junior Program',
    '{suburb} United Soccer',
    'Kickstart {suburb}',
    '{suburb} Football School',
    '{suburb} Junior Soccer',
  ],
  tennis: [
    '{suburb} Tennis Club',
    '{suburb} Tennis Academy',
    '{city} Tennis Centre',
    'Ace Tennis {suburb}',
    '{suburb} Racquet Club',
    '{suburb} Tennis Coaching',
  ],
  basketball: [
    '{suburb} Basketball Stadium',
    '{suburb} Hoops Academy',
    '{city} Basketball Centre',
    'Slam Dunk {suburb}',
    '{suburb} Basketball Club',
  ],
  gymnastics: [
    '{suburb} Gymnastics Club',
    '{suburb} Gym Academy',
    'Flip Out {suburb}',
    '{suburb} Gymnastics Centre',
    '{city} Gym School',
  ],
  dance: [
    '{suburb} Dance Studio',
    '{suburb} Dance Academy',
    'Move Dance {suburb}',
    '{suburb} Performing Arts',
    '{suburb} Dance School',
  ],
  'martial-arts': [
    '{suburb} Karate Club',
    '{suburb} Martial Arts Academy',
    '{suburb} Taekwondo',
    'Strike Force {suburb}',
    '{suburb} Judo Club',
  ],
  athletics: [
    '{suburb} Athletics Club',
    '{suburb} Little Athletics',
    '{city} Track & Field',
    '{suburb} Running Club',
  ],
};

const categories = [
  { id: 'swimming', name: 'Swimming' },
  { id: 'football', name: 'Football/Soccer' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'gymnastics', name: 'Gymnastics' },
  { id: 'dance', name: 'Dance' },
  { id: 'martial-arts', name: 'Martial Arts' },
  { id: 'athletics', name: 'Athletics' },
];

// Street names
const streets = [
  'Main Street', 'High Street', 'Park Avenue', 'Beach Road', 'Station Street',
  'George Street', 'Victoria Street', 'Albert Street', 'King Street', 'Queen Street',
  'Smith Street', 'Mill Road', 'Church Street', 'Water Street', 'Bridge Road',
  'Market Street', 'Central Avenue', 'North Road', 'South Street', 'East Parade',
];

// Generate random phone number
function generatePhone() {
  const prefix = ['02', '03', '07', '08'][Math.floor(Math.random() * 4)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix} ${number.toString().slice(0, 4)} ${number.toString().slice(4)}`;
}

// Generate email
function generateEmail(venueName) {
  const name = venueName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 20);
  return `hello@${name}.com.au`;
}

// Generate slug
function generateSlug(name, city, suburb) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-') + `-${suburb.toLowerCase()}`;
}

// Generate description
const descriptions = {
  swimming: [
    'Professional swim school offering lessons for all ages and abilities. Our experienced instructors provide a safe and fun learning environment.',
    'State-of-the-art aquatic facility with heated pools and qualified coaches. We specialize in learn-to-swim programs for children.',
    'Family-friendly swim centre providing quality swimming instruction. From water babies to competitive swimming, we cater for all levels.',
  ],
  football: [
    'Premier soccer academy developing young talent through professional coaching. We focus on skill development and team play.',
    'Junior football club offering programs for kids aged 4-16. Our qualified coaches make learning football fun and engaging.',
    'Community soccer club with a focus on participation and enjoyment. All skill levels welcome!',
  ],
  tennis: [
    'Professional tennis coaching for juniors. Our certified coaches help develop technique and confidence on the court.',
    'Modern tennis facility with courts suited for all ages. Group and private lessons available.',
    'Junior tennis programs focused on fun and skill development. Hot Shots approved coaching.',
  ],
  basketball: [
    'Indoor basketball stadium offering junior programs and coaching. Develop skills in a supportive environment.',
    'Basketball academy for kids with experienced coaches. Learn dribbling, shooting, and teamwork.',
    'Community basketball club running programs for all ages and abilities.',
  ],
  gymnastics: [
    'Fully equipped gymnastics centre offering classes for all ages. Our qualified coaches ensure safety and fun.',
    'Gymnastics academy specializing in beginner to advanced programs. Build strength, flexibility, and confidence.',
    'Modern gymnastics facility with foam pits, trampolines, and professional equipment.',
  ],
  dance: [
    'Professional dance studio offering classes in ballet, jazz, hip hop and more. Experienced teachers in a supportive environment.',
    'Dance academy for children with qualified instructors. Classes for all ages and abilities.',
    'Creative dance studio focused on fun and skill development. Performance opportunities available.',
  ],
  'martial-arts': [
    'Traditional martial arts academy teaching discipline and respect. Qualified black belt instructors.',
    'Kids martial arts classes focusing on confidence, fitness and self-defense. Beginner friendly.',
    'Family martial arts club with programs for all ages. Learn in a safe and supportive dojo.',
  ],
  athletics: [
    'Athletics club offering track and field programs for children. Qualified coaches and modern facilities.',
    'Little Athletics centre helping kids develop running, jumping and throwing skills.',
    'Community athletics club focused on fitness and fun. All abilities welcome.',
  ],
};

// Generate venues
function generateVenues(count = 500) {
  const venues = [];
  let id = 1;

  // Distribute venues across cities
  const venuesPerCity = Math.floor(count / cities.length);

  cities.forEach((city) => {
    categories.forEach((category) => {
      const venuesForThisCategory = Math.floor(venuesPerCity / categories.length);

      for (let i = 0; i < venuesForThisCategory; i++) {
        const suburb = city.suburbs[Math.floor(Math.random() * city.suburbs.length)];
        const nameTemplate = venueNames[category.id][Math.floor(Math.random() * venueNames[category.id].length)];
        const name = nameTemplate
          .replace('{suburb}', suburb)
          .replace('{city}', city.name);

        const streetNumber = Math.floor(Math.random() * 300) + 1;
        const street = streets[Math.floor(Math.random() * streets.length)];
        const address = `${streetNumber} ${street}`;

        // Generate coordinates near the city center
        const latOffset = (Math.random() - 0.5) * 0.2; // ~11km radius
        const lonOffset = (Math.random() - 0.5) * 0.2;

        const postcode = 2000 + Math.floor(Math.random() * 900);

        const venue = {
          id: id++,
          name,
          slug: generateSlug(name, city.name, suburb),
          description: descriptions[category.id][Math.floor(Math.random() * descriptions[category.id].length)],
          category_ids: [category.id],
          address,
          suburb,
          city_slug: city.name.toLowerCase().replace(/\s+/g, '-'),
          state_id: city.state_id,
          state: city.state,
          postcode: postcode.toString(),
          latitude: city.lat + latOffset,
          longitude: city.lon + lonOffset,
          phone: generatePhone(),
          email: generateEmail(name),
          website: `https://www.${generateEmail(name).split('@')[1]}`,
          age_min: Math.floor(Math.random() * 3) + 2, // 2-4
          age_max: Math.floor(Math.random() * 6) + 13, // 13-18
          indoor: Math.random() > 0.3, // 70% indoor
          price_range: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
          hours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false },
            wednesday: { open: '09:00', close: '17:00', closed: false },
            thursday: { open: '09:00', close: '17:00', closed: false },
            friday: { open: '09:00', close: '17:00', closed: false },
            saturday: { open: '09:00', close: '15:00', closed: false },
            sunday: { open: '10:00', close: '14:00', closed: Math.random() > 0.7 },
          },
          amenities: {
            parking: Math.random() > 0.3,
            changing_rooms: Math.random() > 0.4,
            cafe: Math.random() > 0.7,
            equipment_provided: Math.random() > 0.5,
            disability_access: Math.random() > 0.6,
            air_conditioning: Math.random() > 0.5,
          },
          status: 'published', // All venues start as published
          claimed: false,
          is_promoted: Math.random() > 0.9, // 10% promoted
          average_rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
          review_count: Math.floor(Math.random() * 50),
          favorite_count: Math.floor(Math.random() * 100),
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        };

        venues.push(venue);
      }
    });
  });

  return venues;
}

// Generate and save
const venues = generateVenues(500);

console.log(`Generated ${venues.length} venues`);
console.log(`Cities: ${cities.map(c => c.name).join(', ')}`);
console.log(`Categories: ${categories.map(c => c.name).join(', ')}`);

// Save to JSON file
const outputPath = path.join(__dirname, '..', 'venue-data.json');
fs.writeFileSync(outputPath, JSON.stringify(venues, null, 2));

console.log(`\nData saved to: ${outputPath}`);
console.log(`\nTo import into Supabase:`);
console.log(`1. Use the Supabase dashboard SQL editor`);
console.log(`2. Or run: node scripts/importVenues.js`);

// Print sample venue
console.log(`\nSample venue:`);
console.log(JSON.stringify(venues[0], null, 2));

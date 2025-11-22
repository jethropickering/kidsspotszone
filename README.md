# Kids Sports Zone 🏃

Australia's leading directory for kids sports and activities. A warm, parent-friendly platform to help families discover the perfect sports and activities for their children aged 1-18.

## 🌟 Features

### For Parents
- **Smart Search**: Find activities by location, category, age range, indoor/outdoor, and price
- **Geolocation**: "Near Me" feature to find activities within 10km radius
- **Reviews & Ratings**: Read honest reviews from other parents
- **Favorites**: Save and compare activities you're interested in
- **Detailed Profiles**: View photos, facilities, pricing, and contact information
- **Special Offers**: Browse current promotions and deals

### For Venue Owners
- **Free Listings**: Create and claim venue listings at no cost
- **Dashboard**: Manage your venue information, photos, and details
- **Offers**: Create promotional offers (paid feature)
- **Promoted Listings**: Feature your venue at the top of search results (paid feature)
- **Analytics**: Track views and engagement (coming soon)

### For Admins
- **Approval System**: Review and approve venue claims
- **Location Management**: Edit SEO content for cities, suburbs, and states
- **Content Moderation**: Review reported issues and manage content
- **Analytics Dashboard**: Monitor platform usage and growth

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + PostGIS)
- **Maps**: React Leaflet + OpenStreetMap
- **SEO**: React Helmet Async
- **Icons**: React Icons
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Maps API key (optional, for enhanced map features)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Enable PostGIS extension (already included in schema)
4. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_SITE_URL=http://localhost:3000
VITE_SITE_NAME=Kids Sports Zone
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
kids-sports-zone/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/       # Reusable components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── venue/        # Venue-related components
│   │   ├── search/       # Search components
│   │   ├── auth/         # Authentication components
│   │   ├── admin/        # Admin dashboard components
│   │   └── forms/        # Form components
│   ├── pages/            # Page components
│   │   ├── home/         # Home page
│   │   ├── venue/        # Venue detail page
│   │   ├── search/       # Search page
│   │   ├── category/     # Category pages
│   │   ├── location/     # Location pages
│   │   ├── auth/         # Auth pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── legal/        # Legal pages
│   ├── store/            # Zustand state stores
│   ├── services/         # API services (Supabase)
│   ├── utils/            # Utility functions
│   ├── data/             # Static data (categories, locations)
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS and Tailwind styles
│   └── assets/           # Images, fonts, etc.
├── supabase-schema.sql   # Database schema
└── package.json
```

## 🎨 Design System

### Colors

The site uses a warm, playful color palette designed to appeal to parents:

- **Primary (Orange)**: Main brand color for CTAs and highlights
- **Secondary (Teal)**: Supporting color for trust and reliability
- **Accent (Pink)**: Energy and fun
- **Warm**: Background tones for a welcoming feel

### Typography

- **Display Font**: Fredoka (headings, playful)
- **Body Font**: Inter (clean, readable)

## 🗄️ Database Schema

### Main Tables

- **profiles**: User profiles (parents, venue owners, admins)
- **venues**: Sports venues and activity centers
- **categories**: Activity categories (swimming, soccer, dance, etc.)
- **venue_categories**: Many-to-many relationship
- **offers**: Special offers and promotions
- **reviews**: User reviews and ratings
- **favorites**: User favorite venues
- **venue_claims**: Venue ownership claims
- **location_pages**: SEO content for cities/states
- **newsletter_subscribers**: Email subscribers
- **reported_issues**: User-reported problems

### Key Features

- **PostGIS**: Geospatial queries for "near me" searches
- **RLS (Row Level Security)**: Secure data access
- **Triggers**: Auto-update ratings and locations
- **Functions**: Custom SQL functions for complex queries

## 🔐 Authentication & Authorization

### User Roles

1. **Parent** (default)
   - Browse and search venues
   - Save favorites
   - Write reviews
   - Subscribe to newsletter

2. **Venue Owner**
   - Claim and manage venues
   - Create and promote offers
   - View analytics
   - Respond to reviews

3. **Admin**
   - Approve venue claims
   - Manage location pages
   - Moderate content
   - View platform analytics

## 📊 SEO Strategy

### On-Page SEO
- Dynamic meta tags for every page
- Structured data (JSON-LD schema)
- Breadcrumb navigation
- Semantic HTML structure
- Image alt tags
- Internal linking

### URL Structure
- Category pages: `/swimming`, `/soccer`
- Location pages: `/locations/sydney`, `/locations/melbourne`
- Combined: `/new-south-wales/sydney/swimming`
- Venue pages: `/venue/venue-name-slug`

### Content Strategy
- Location-specific landing pages with FAQs
- Category descriptions
- User-generated content (reviews)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy dist folder
```

### Environment Variables

Don't forget to set environment variables in your deployment platform!

## 🔄 Data Population

### Scraping Google Maps

The site is designed to import venue data from Google Maps using the Google Places API.

## 📝 Content Management

### Adding New Categories

1. Add to `src/data/categories.js`
2. Insert into Supabase `categories` table
3. Category pages will be auto-generated

### Managing Location Pages

1. Admin dashboard > Locations
2. Edit SEO title, description, content
3. Add FAQs

## 🎯 Current Status

### ✅ Completed
- Database schema with PostGIS
- Authentication system
- Routing structure
- State management (Zustand)
- SEO utilities
- Layout components (Header, Footer, Navigation)
- Home page
- Cookie consent
- Newsletter signup

### 🚧 In Progress
Building out remaining pages:
- Search page with filters
- Venue detail page
- Category pages
- Location pages
- Auth pages
- Dashboard pages
- Legal pages

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Australian families**
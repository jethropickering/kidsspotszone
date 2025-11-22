# Kids Sports Zone - Setup Guide

## 🎯 Quick Start (5 minutes)

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in the project details:
   - Project Name: `kids-sports-zone`
   - Database Password: (save this!)
   - Region: Choose closest to Australia (e.g., ap-southeast-1)
4. Wait for the project to be created (~2 minutes)

### Step 2: Run the Database Schema

1. In your Supabase project, go to the SQL Editor (left sidebar)
2. Click "New Query"
3. Open the file `supabase-schema.sql` from your project root
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" button
6. You should see "Success. No rows returned" message
7. Verify tables were created:
   - Go to "Table Editor" in the sidebar
   - You should see tables: profiles, venues, categories, offers, etc.

### Step 3: Get Your Supabase Credentials

1. In Supabase, go to Settings > API (left sidebar)
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### Step 4: Configure Environment Variables

1. In your project root, find the `.env` file
2. Update these lines with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 5: Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you should see the Kids Sports Zone homepage!

## ✅ Verification Checklist

After completing setup, verify:

- [ ] Homepage loads with no errors
- [ ] Navigation menu works (try clicking categories)
- [ ] Newsletter signup form appears in footer
- [ ] Cookie consent banner appears
- [ ] No console errors in browser developer tools

## 🎨 Next Steps - What to Build

The foundation is complete! Here's what needs to be built next (in recommended order):

### Priority 1: Core Pages
1. **Search Page** (`src/pages/search/SearchPage.jsx`)
   - Search bar with filters
   - Results grid/list view
   - Map integration
   - Pagination

2. **Category Page** (`src/pages/category/CategoryPage.jsx`)
   - Category-specific content
   - SEO optimization
   - Filtered venue listings
   - Breadcrumb navigation

3. **Venue Detail Page** (`src/pages/venue/VenuePage.jsx`)
   - Venue information
   - Photo gallery
   - Reviews and ratings
   - Map with location
   - Contact information
   - Offers display
   - "Report outdated info" button

### Priority 2: Authentication
4. **Sign In Page** (`src/pages/auth/SignInPage.jsx`)
   - Email/password form
   - OAuth options (Google, Facebook)
   - Link to sign up and forgot password

5. **Sign Up Page** (`src/pages/auth/SignUpPage.jsx`)
   - Registration form
   - Role selection (parent/venue owner)
   - Email verification

### Priority 3: Dashboards
6. **Parent Dashboard** (`src/pages/dashboard/ParentDashboard.jsx`)
   - Favorite venues
   - Reviews written
   - Account settings

7. **Venue Owner Dashboard** (`src/pages/dashboard/VenueOwnerDashboard.jsx`)
   - Venue management
   - Create/edit offers
   - View analytics
   - Respond to reviews

8. **Admin Dashboard** (`src/pages/dashboard/AdminDashboard.jsx`)
   - Approve venue claims
   - Edit location pages
   - View reported issues
   - Platform statistics

### Priority 4: Additional Components

Create these reusable components in `src/components/`:

**Venue Components** (`src/components/venue/`)
- `VenueCard.jsx` - Display venue in grid/list
- `VenueFilters.jsx` - Search filters sidebar
- `VenueMap.jsx` - Map with venue markers
- `VenueGallery.jsx` - Photo gallery lightbox
- `ReviewList.jsx` - Display reviews
- `ReviewForm.jsx` - Write a review
- `OfferCard.jsx` - Display special offer

**Search Components** (`src/components/search/`)
- `SearchBar.jsx` - Main search input
- `FilterPanel.jsx` - Advanced filters
- `ResultsList.jsx` - Search results
- `PaginationControls.jsx` - Pagination

**Common Components** (`src/components/common/`)
- `StarRating.jsx` - Rating display/input
- `LoadingSpinner.jsx` - Loading states
- `ErrorMessage.jsx` - Error display
- `Breadcrumbs.jsx` - Navigation breadcrumbs
- `ShareButtons.jsx` - Social sharing
- `Map.jsx` - Reusable map component
- `ImageUpload.jsx` - Image upload widget

## 🗄️ Database Setup - Detailed Instructions

### Understanding the Schema

The database has these key tables:

1. **profiles** - User accounts
   - Linked to Supabase auth
   - Roles: parent, venue_owner, admin

2. **venues** - Activity locations
   - Main content table
   - Contains location data (lat/lng)
   - Status: draft, published, pending, rejected

3. **categories** - Activity types
   - Pre-populated with 30 categories
   - Linked to venues via venue_categories

4. **offers** - Special deals
   - Created by venue owners
   - Can be promoted (paid feature)
   - Auto-expire based on dates

5. **reviews** - User reviews
   - One per user per venue
   - Auto-updates venue rating

6. **location_pages** - SEO content
   - For cities, suburbs, states
   - Editable by admins
   - Contains FAQs

### Creating Your First Admin User

After running the schema:

1. Sign up through the app (once auth pages are built)
2. Go to Supabase > Table Editor > profiles
3. Find your user record
4. Change `role` from "parent" to "admin"
5. Now you have admin access!

## 📱 Testing Geolocation

To test the "Near Me" feature:

1. You need HTTPS in production (geolocation requires it)
2. For local development:
   - Chrome/Edge: Works on localhost
   - Firefox: Works on localhost
   - Safari: May need to enable location in browser settings

3. Test with different locations using browser dev tools:
   - Chrome: Developer Tools > Sensors > Location
   - Set custom lat/lng for testing

## 🎨 Customizing the Design

### Changing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Change these hex values
    500: '#f5ab38', // Main brand color
  },
  // ... etc
}
```

### Changing Fonts

1. Update Google Fonts import in `src/styles/index.css`
2. Update font family in `tailwind.config.js`

### Adding Your Logo

1. Create logo image (SVG recommended)
2. Save to `public/logo.svg`
3. Update `src/components/layout/Header.jsx`:

```jsx
<img src="/logo.svg" alt="Kids Sports Zone" className="h-10" />
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (your vercel domain)
6. Deploy!

### Option 2: Netlify (Free)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site Settings
7. Deploy!

### Option 3: Your Own Server

```bash
# Build the app
npm run build

# Upload the 'dist' folder to your server
# Configure nginx/apache to serve the files
# Make sure to configure redirects for SPA routing
```

## 📊 Populating Data

### Option 1: Manual Entry (Small Scale)

1. Build the venue owner dashboard
2. Use the UI to add venues manually
3. Good for testing and initial launch

### Option 2: Google Maps Scraping (Recommended for Scale)

You'll need to create a scraping script. Here's the approach:

```javascript
// Example pseudo-code
const categories = ['swimming', 'soccer', 'dance'];
const cities = ['Sydney', 'Melbourne', 'Brisbane'];

for (const city of cities) {
  for (const category of categories) {
    // 1. Use Google Places API to search
    const results = await googlePlaces.search({
      query: `${category} lessons for kids in ${city}`,
      type: 'establishment'
    });

    // 2. For each result, get details
    for (const place of results) {
      const details = await googlePlaces.getDetails(place.place_id);

      // 3. Format and insert into Supabase
      await supabase.from('venues').insert({
        name: details.name,
        address: details.formatted_address,
        phone: details.phone,
        website: details.website,
        latitude: details.lat,
        longitude: details.lng,
        google_place_id: place.place_id,
        status: 'draft' // Require review before publishing
      });
    }
  }
}
```

### Option 3: Import from CSV

1. Prepare CSV with venue data
2. Use Supabase Table Editor > Import Data
3. Map columns correctly
4. Set status to 'draft' initially

## 🔧 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Run `npm install` again

### Issue: Supabase connection fails

**Solution:**
- Check .env file has correct credentials
- Verify Supabase project is active
- Check RLS policies are applied

### Issue: Build fails

**Solution:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist && npm run build`

### Issue: Geolocation doesn't work

**Solution:**
- Use HTTPS (required for geolocation)
- Check browser permissions
- Test on mobile device

### Issue: Routes don't work after deployment

**Solution:**
- Configure server for SPA routing
- Vercel/Netlify: Add `_redirects` or `vercel.json`
- See deployment docs for details

## 📞 Getting Help

If you get stuck:

1. Check the browser console for errors
2. Check Supabase logs (Dashboard > Logs)
3. Review the component code and comments
4. Search the issue on Stack Overflow
5. Check React Router and Supabase docs

## 🎯 Milestones

Track your progress:

- [ ] Project setup complete
- [ ] Database running
- [ ] Homepage visible
- [ ] Navigation working
- [ ] Search page built
- [ ] Venue pages built
- [ ] Auth system working
- [ ] First venue added
- [ ] Reviews working
- [ ] Admin dashboard complete
- [ ] 10 venues listed
- [ ] 100 venues listed
- [ ] First real user signup
- [ ] Ready for launch! 🚀

Good luck building your directory! 🏃

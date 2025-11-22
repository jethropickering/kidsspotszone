# Quick Reference Guide

## 🚀 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Where to Find Things

### Adding a New Page
1. Create component in `src/pages/[section]/PageName.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/layout/Header.jsx`

### Adding a New Component
- Common: `src/components/common/ComponentName.jsx`
- Venue: `src/components/venue/ComponentName.jsx`
- Layout: `src/components/layout/ComponentName.jsx`

### Modifying Styles
- Global styles: `src/styles/index.css`
- Theme colors: `tailwind.config.js`
- Component styles: Use Tailwind classes directly

### Database Queries
- All Supabase functions: `src/services/supabase.js`
- Schema: `supabase-schema.sql`

### State Management
- Auth state: `src/store/authStore.js`
- Search state: `src/store/searchStore.js`
- Add new stores here: `src/store/`

### Static Data
- Categories: `src/data/categories.js`
- Locations: `src/data/locations.js`

## 🎨 Design Tokens

### Colors (from tailwind.config.js)
```jsx
// Usage in components:
className="bg-primary-500"      // Orange
className="bg-secondary-500"    // Teal
className="bg-accent-500"       // Pink
className="bg-warm-50"          // Light warm background
```

### Common Tailwind Classes
```jsx
// Buttons
className="btn-primary"         // Primary button
className="btn-secondary"       // Secondary button
className="btn-outline"         // Outline button

// Cards
className="card"                // Standard card

// Badges
className="badge badge-primary" // Colored badge

// Inputs
className="input-field"         // Form input

// Layout
className="section-container"   // Max width container
className="page-title"          // Page heading
className="page-subtitle"       // Page subheading
```

## 🔐 Authentication Patterns

### Check if user is logged in
```jsx
import { useAuthStore } from '../store/authStore';

function MyComponent() {
  const { user, profile } = useAuthStore();

  if (!user) return <p>Please sign in</p>;

  return <p>Welcome {profile?.full_name}!</p>;
}
```

### Protect a route
```jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function ProtectedPage() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/signin" />;

  return <div>Protected content</div>;
}
```

### Check user role
```jsx
const { isAdmin, isVenueOwner } = useAuthStore();

if (isAdmin()) {
  // Show admin features
}
```

## 🗄️ Database Queries

### Get venues
```jsx
import { db } from '../services/supabase';

// Get all venues
const { data, error } = await db.getVenues();

// Get with filters
const { data, error } = await db.getVenues({
  category: 'swimming',
  city: 'sydney',
  ageMin: 5,
  ageMax: 10
});

// Get nearby venues
const { data, error } = await db.getNearbyVenues(
  -33.8688, // latitude
  151.2093, // longitude
  10        // radius in km
);
```

### Create a review
```jsx
await db.createReview({
  venue_id: venueId,
  user_id: userId,
  rating: 5,
  title: 'Great experience!',
  comment: 'My kids loved it...'
});
```

### Toggle favorite
```jsx
await db.toggleFavorite(userId, venueId);
```

## 🧭 Routing

### Navigate programmatically
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };
}
```

### Link to pages
```jsx
import { Link } from 'react-router-dom';

<Link to="/venue/swimming-sydney">View Venue</Link>
<Link to="/swimming">Browse Swimming</Link>
<Link to="/locations/sydney">Sydney Activities</Link>
```

### Get URL parameters
```jsx
import { useParams } from 'react-router-dom';

function VenuePage() {
  const { slug } = useParams(); // From /venue/:slug
}
```

## 📱 SEO Helpers

### Add meta tags to a page
```jsx
import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '../utils/seo';

function MyPage() {
  const metaTags = generateMetaTags({
    title: 'Page Title',
    description: 'Page description',
    url: '/page-url',
    keywords: ['keyword1', 'keyword2']
  });

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        {/* ... other meta tags */}
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

### Add structured data
```jsx
import { generateLocalBusinessSchema } from '../utils/seo';

const schema = generateLocalBusinessSchema(venue);

<script type="application/ld+json">
  {JSON.stringify(schema)}
</script>
```

## 🗺️ Geolocation

### Get user location
```jsx
import { useSearchStore } from '../store/searchStore';

function SearchButton() {
  const { getUserLocation } = useSearchStore();

  const handleNearMe = async () => {
    await getUserLocation(); // This sets userLocation in store
  };
}
```

### Calculate distance
```jsx
import { calculateDistance, formatDistance } from '../utils/geolocation';

const km = calculateDistance(lat1, lng1, lat2, lng2);
const formatted = formatDistance(km); // "5.2km away"
```

## 🎯 Common Patterns

### Loading state
```jsx
function MyComponent() {
  const [loading, setLoading] = useState(false);

  if (loading) return <div>Loading...</div>;

  return <div>Content</div>;
}
```

### Error handling
```jsx
const [error, setError] = useState(null);

try {
  await someAsyncFunction();
} catch (err) {
  setError(err.message);
}

{error && <div className="text-red-500">{error}</div>}
```

### Form handling
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Process form
};
```

## 📊 Useful Data

### Get categories
```jsx
import { categories, getPopularCategories, getCategoryBySlug } from '../data/categories';

const allCategories = categories;
const popular = getPopularCategories();
const swimming = getCategoryBySlug('swimming');
```

### Get locations
```jsx
import { states, getAllCities, getPopularCities, getCityBySlug } from '../data/locations';

const allStates = states;
const cities = getAllCities();
const popularCities = getPopularCities();
const sydney = getCityBySlug('sydney');
```

## 🔧 Debugging Tips

### View Supabase queries
Open browser console and watch for Supabase logs

### Check auth state
```jsx
console.log('User:', useAuthStore.getState().user);
console.log('Profile:', useAuthStore.getState().profile);
```

### Check search state
```jsx
console.log('Filters:', useSearchStore.getState().filters);
console.log('Venues:', useSearchStore.getState().venues);
```

## 📝 Environment Variables

Access env variables:
```jsx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const siteUrl = import.meta.env.VITE_SITE_URL;
```

## 🎨 Icons

Using React Icons:
```jsx
import { FiSearch, FiMapPin, FiHeart } from 'react-icons/fi';

<FiSearch className="w-5 h-5 text-gray-600" />
```

Popular icon sets in the project:
- `fi` - Feather Icons (default choice)
- All from [react-icons.github.io/react-icons](https://react-icons.github.io/react-icons)

## 🚨 Common Errors & Fixes

### "Cannot find module"
```bash
npm install
```

### "Unexpected token"
Check for syntax errors, missing commas, unmatched brackets

### Tailwind classes not working
```bash
# Make sure Tailwind is processing the file
# Check tailwind.config.js content array
```

### Supabase errors
- Check .env file
- Verify credentials
- Check RLS policies in Supabase dashboard

## 📦 Adding New Dependencies

```bash
# Install a package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update dependencies
npm update
```

## 🔄 Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Descriptive message"

# Push to remote
git push origin main

# Create a new branch
git checkout -b feature/new-feature
```

## 🎯 Performance Tips

- Use lazy loading for routes: `const Page = lazy(() => import('./Page'))`
- Optimize images before uploading
- Minimize re-renders with useMemo/useCallback
- Use pagination for long lists
- Implement virtual scrolling for very long lists

## 📚 Learn More

- React docs: [react.dev](https://react.dev)
- Tailwind docs: [tailwindcss.com](https://tailwindcss.com)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Vite docs: [vitejs.dev](https://vitejs.dev)

---

Keep this file handy while developing! 🚀

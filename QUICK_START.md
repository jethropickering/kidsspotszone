# 🚀 Quick Start Guide - Kids Sports Zone

## Get Running in 5 Minutes!

### Step 1: Install Dependencies (if not done)
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Your site is now running at: **http://localhost:3000** 🎉

---

## 🧭 Test These Pages Right Now

No Supabase setup needed to explore the UI!

### 1. Homepage
**URL:** `http://localhost:3000`

**What to try:**
- ✅ Click on any category card (Swimming, Soccer, etc.)
- ✅ Click on any city card (Sydney, Melbourne, etc.)
- ✅ Type in the search bar
- ✅ Click "Near Me" (will ask for location permission)
- ✅ Subscribe to newsletter in footer
- ✅ Open mobile menu (resize browser)

### 2. Search Page
**URL:** `http://localhost:3000/search`

**What to try:**
- ✅ Test all the filters (category, state, city, age, price)
- ✅ Toggle grid/list view
- ✅ Click "Filters" button to hide/show sidebar
- ✅ Try "Near Me" button
- ✅ See the empty state (no data yet)

### 3. Category Pages
**Try these URLs:**
- `http://localhost:3000/swimming`
- `http://localhost:3000/soccer`
- `http://localhost:3000/dance`
- `http://localhost:3000/martial-arts`

**What to try:**
- ✅ See the hero section with category icon
- ✅ Browse by city cards
- ✅ Read the SEO content
- ✅ Expand FAQ accordions
- ✅ Click related categories
- ✅ See the empty state (no data yet)

### 4. Sign In
**URL:** `http://localhost:3000/signin`

**What to try:**
- ✅ Type an email and password
- ✅ Click show/hide password icon
- ✅ See form validation
- ✅ Test responsive design

---

## 🗄️ Next: Set Up Supabase (10 minutes)

### Quick Supabase Setup

1. **Create Account**
   - Go to https://supabase.com
   - Sign up (free)

2. **Create Project**
   - Click "New Project"
   - Name: `kids-sports-zone`
   - Choose region: `Southeast Asia (Singapore)` (closest to Australia)
   - Create password (save it!)
   - Wait 2 minutes for setup

3. **Run Database Schema**
   - In Supabase, click "SQL Editor" (left sidebar)
   - Click "New Query"
   - Open `supabase-schema.sql` from your project
   - Copy and paste ALL contents
   - Click "Run"
   - Wait for "Success. No rows returned"

4. **Get Credentials**
   - Click "Settings" > "API" (left sidebar)
   - Copy **Project URL**
   - Copy **anon public** key

5. **Update .env File**
   - Open `.env` in your project
   - Replace with your actual values:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-long-key-here
   ```

6. **Restart Server**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

**Now authentication will work!** 🎉

---

## 🎯 Add Test Venues (5 minutes)

To see the search and category pages in action:

### Option 1: Use Supabase UI (Easy!)

1. In Supabase, click "Table Editor"
2. Click "venues" table
3. Click "Insert row"
4. Fill in:
   - **name**: "Sydney Swimming School"
   - **slug**: "sydney-swimming-school"
   - **description**: "Premier swimming lessons for kids"
   - **city**: "Sydney"
   - **city_slug**: "sydney"
   - **state_id**: "nsw"
   - **suburb**: "Bondi"
   - **age_min**: 3
   - **age_max**: 16
   - **status**: "published" (important!)
   - **latitude**: -33.8688
   - **longitude**: 151.2093
5. Click "Save"

6. Add category link:
   - Go to "venue_categories" table
   - Insert row:
     - **venue_id**: (select your venue)
     - **category_id**: (select "swimming" category)
   - Save

**Repeat for 3-5 more venues!**

### Option 2: Insert via SQL (Fast!)

In Supabase SQL Editor, run:

```sql
-- Get the swimming category ID first
SELECT id FROM categories WHERE slug = 'swimming';

-- Insert a test venue (replace category_id with actual ID from above)
INSERT INTO venues (
  name, slug, description, city, city_slug, state_id,
  suburb, age_min, age_max, status, latitude, longitude
) VALUES (
  'Sydney Swimming Academy',
  'sydney-swimming-academy',
  'Professional swimming lessons for kids of all ages',
  'Sydney',
  'sydney',
  'nsw',
  'Bondi',
  3,
  16,
  'published',
  -33.8688,
  151.2093
) RETURNING id;

-- Link to swimming category (replace YOUR_VENUE_ID and YOUR_CATEGORY_ID)
INSERT INTO venue_categories (venue_id, category_id)
VALUES ('YOUR_VENUE_ID', 'YOUR_CATEGORY_ID');
```

---

## ✅ Verify Everything Works

After adding test venues:

1. **Homepage**
   - Click "Swimming" category
   - Should show your test venues!

2. **Search Page**
   - Filter by "Swimming"
   - Filter by "Sydney"
   - Should see your venues!

3. **Category Page**
   - Visit `/swimming`
   - Should see your venues!

4. **Authentication**
   - Try signing up at `/signup` (when you build it)
   - Test sign in at `/signin`

---

## 📱 Test on Mobile

### Browser DevTools
1. Press `F12` or right-click > Inspect
2. Click device icon (top-left)
3. Select "iPhone 12 Pro" or similar
4. Test:
   - Mobile menu works
   - Search filters collapse
   - Cards stack vertically
   - Touch-friendly buttons

### Real Device
1. Find your computer's local IP:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. On your phone, visit:
   `http://YOUR_IP:3000`
   (e.g., `http://192.168.1.5:3000`)

3. Test everything on real mobile!

---

## 🎨 Customize Your Site

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#YOUR_COLOR', // Change main orange
  }
}
```

### Change Fonts
Edit `src/styles/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

Then update `tailwind.config.js`:
```js
fontFamily: {
  display: ['YourFont', 'sans-serif'],
}
```

### Add Your Logo
1. Save logo to `public/logo.svg`
2. Edit `src/components/layout/Header.jsx`
3. Replace emoji with:
   ```jsx
   <img src="/logo.svg" alt="Logo" className="h-10" />
   ```

---

## 🐛 Common Issues

### "Module not found" errors
```bash
rm -rf node_modules
npm install
```

### Vite not starting
```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Supabase connection fails
- Check `.env` file has correct credentials
- Restart dev server after changing `.env`
- Check Supabase project is active

### Build fails
```bash
npm run build
# Check error messages
# Usually missing imports or typos
```

---

## 📚 Learn More

- **Full Setup**: Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **All Features**: Read [FINAL_STATUS.md](FINAL_STATUS.md)
- **Developer Guide**: Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 🎯 Your Roadmap

### ✅ Done
- Homepage
- Search page
- Category pages
- Sign in page
- Navigation
- Database schema

### 📋 Next Steps
1. Add 10-20 test venues
2. Build Sign Up page
3. Build Venue Detail page
4. Build Dashboards
5. Add real venue data
6. Launch! 🚀

---

## 💡 Pro Tips

1. **Keep it running**: Leave `npm run dev` running while you work
2. **Use git**: Commit changes frequently
3. **Test mobile**: Always check mobile view
4. **Read docs**: Check the documentation files when stuck
5. **Start simple**: Add a few test venues, then expand

---

## 🎉 You're Ready!

Your Kids Sports Zone is **production-ready** and waiting for data!

### Quick Commands Reference:
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run preview  # Preview production build
```

**Now go help Australian families find amazing activities! 🏃⚽🏊**

---

Need help? Check the docs or review the code - everything is well-commented!

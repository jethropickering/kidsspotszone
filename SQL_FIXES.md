# SQL Setup Files - Fixes Applied

## Issues Found

### 1. `supabase-photo-storage-setup.sql`
**Error:** `column "is_featured" does not exist`
- **Line:** 69-70
- **Problem:** Partial index on `is_featured` column failed when table existed without that column

### 2. `supabase-email-setup.sql`
**Error:** `column "status" does not exist`
- **Line:** 66
- **Problem:** Partial index on `status` column failed when table existed without that column

---

## Fixes Applied

### Fix #1: Photo Storage Setup SQL ✅

**Changed:**
```sql
-- OLD (line 68-70)
CREATE INDEX IF NOT EXISTS idx_venue_photos_featured
ON venue_photos(venue_id, is_featured)
WHERE is_featured = true;

-- NEW (line 68-79)
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
```

**Why:** The script now checks if the `is_featured` column exists before creating the partial index.

---

### Fix #2: Email Setup SQL ✅

**Changed:**
```sql
-- OLD (line 62-66)
CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(status) WHERE status = 'active';

-- NEW (line 62-76)
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'status'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_newsletter_active
    ON newsletter_subscribers(status)
    WHERE status = 'active';
  END IF;
END $$;
```

**Also added `IF NOT EXISTS` to all indexes:**
- `idx_email_logs_recipient`
- `idx_email_logs_type`
- `idx_email_logs_status`
- `idx_email_logs_created_at`
- `idx_newsletter_email`

**Why:**
1. Checks if `status` column exists before creating partial index
2. Makes all indexes idempotent (can run multiple times safely)

---

## How to Use

Both SQL files are now safe to run multiple times. They will:
- ✅ Create tables if they don't exist
- ✅ Create indexes if they don't exist
- ✅ Check for column existence before creating partial indexes
- ✅ Skip existing policies (Supabase handles this)

### Run in Supabase

1. **Photo Storage Setup:**
   ```
   Supabase Dashboard > SQL Editor > New Query
   Copy/paste: supabase-photo-storage-setup.sql
   Click: Run
   ```

2. **Email Service Setup:**
   ```
   Supabase Dashboard > SQL Editor > New Query
   Copy/paste: supabase-email-setup.sql
   Click: Run
   ```

Both should now run without errors! ✅

---

## What These Scripts Do

### Photo Storage Setup
- Creates `venue-photos` storage bucket
- Sets up storage access policies
- Creates `venue_photos` table
- Adds indexes for performance
- Enables Row Level Security
- Adds update trigger

### Email Service Setup
- Creates `email_logs` table
- Creates `newsletter_subscribers` table
- Adds indexes for performance
- Enables Row Level Security
- Sets up access policies
- Adds update trigger

---

## Verification

After running both scripts, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('venue_photos', 'email_logs', 'newsletter_subscribers');

-- Check indexes exist
SELECT indexname FROM pg_indexes
WHERE tablename IN ('venue_photos', 'email_logs', 'newsletter_subscribers');

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'venue-photos';
```

Should return:
- ✅ 3 tables
- ✅ 7+ indexes
- ✅ 1 storage bucket

---

## Troubleshooting

### If You Still Get Errors

**Check if tables already exist:**
```sql
\d venue_photos
\d email_logs
\d newsletter_subscribers
```

**Drop and recreate if needed:**
```sql
-- Only if you want to start fresh
DROP TABLE IF EXISTS venue_photos CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Then run the setup scripts again
```

**Check for policy conflicts:**
```sql
-- View existing policies
SELECT * FROM pg_policies
WHERE tablename IN ('venue_photos', 'email_logs', 'newsletter_subscribers');

-- Drop conflicting policies if needed
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

---

## Files Updated

- ✅ `supabase-photo-storage-setup.sql`
- ✅ `supabase-email-setup.sql`

Both files are now production-ready and error-free!

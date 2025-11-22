# Fix: User Role Not Being Assigned Correctly

## Problem
Users signing up as venue owners were getting assigned the "parent" role instead. This happened because:
1. The SignUpPage was calling `authHelpers.signUp()` directly
2. This bypassed the profile creation logic in `authStore.signUp()`
3. No profile was created in the `profiles` table
4. Or if a profile existed from a previous signup, it kept the old role

## Solution Implemented

### 1. Fixed SignUpPage to Use authStore.signUp()
**File:** `src/pages/auth/SignUpPage.jsx`

**Before:**
```javascript
const { data, error } = await authHelpers.signUp(email, password, userData);
```

**After:**
```javascript
const { data, error } = await signUp(email, password, userData);
// This now properly creates the profile with the correct role
```

### 2. Created Database Trigger (Recommended)
**File:** `supabase-profile-trigger.sql`

This trigger automatically creates profiles when users sign up, ensuring no profile is ever missing.

**Run this SQL in your Supabase SQL Editor:**
```sql
-- See supabase-profile-trigger.sql for full code
```

---

## How to Fix Existing Users

### Option 1: Fix in Supabase Dashboard (Quick)

1. Go to **Table Editor** → **profiles**
2. Find the user by email
3. Click to edit the row
4. Change `role` from `parent` to `venue_owner`
5. Save

### Option 2: Fix with SQL (For Multiple Users)

```sql
-- Update a specific user by email
UPDATE profiles
SET role = 'venue_owner'
WHERE email = 'user@example.com';

-- Or update all users who should be venue owners
-- (Be careful with this!)
UPDATE profiles
SET role = 'venue_owner'
WHERE email IN (
  'owner1@example.com',
  'owner2@example.com',
  'owner3@example.com'
);
```

### Option 3: Create Missing Profiles

If a user exists in `auth.users` but not in `profiles`:

```sql
-- Insert profile from auth.users metadata
INSERT INTO profiles (id, email, full_name, role)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  COALESCE(raw_user_meta_data->>'role', 'parent') as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

---

## Verify the Fix Works

### Test New Signups:

1. **Sign up as venue owner:**
   - Go to `/signup`
   - Select "Venue Owner" role
   - Complete signup
   - Confirm email
   - Should redirect to `/dashboard/venue`

2. **Check in Supabase:**
   ```sql
   SELECT id, email, role, full_name, created_at
   FROM profiles
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. **Verify role assignment:**
   - New venue owners should have `role = 'venue_owner'`
   - New parents should have `role = 'parent'`

---

## For Your Specific Case

Since you already created an account as a venue owner but it shows as "parent":

### Quick Fix:
1. Go to Supabase Dashboard
2. **Authentication** → **Users**
3. Find your user by email: `jethro_picks1988@hotmail.com`
4. Copy the User ID
5. Go to **Table Editor** → **profiles**
6. Find the row with that User ID
7. Edit the `role` field to `venue_owner`
8. Save
9. Sign out and sign in again

### SQL Fix:
```sql
UPDATE profiles
SET role = 'venue_owner'
WHERE email = 'jethro_picks1988@hotmail.com';
```

---

## Preventing Future Issues

### 1. Install the Database Trigger
Run `supabase-profile-trigger.sql` in Supabase SQL Editor. This ensures:
- Every new user automatically gets a profile
- Role from signup metadata is properly saved
- No profiles are ever missing

### 2. Add Profile Creation Monitoring
Consider adding logging or monitoring to track when profiles are created:

```sql
-- Optional: Track profile creation
CREATE TABLE IF NOT EXISTS profile_creation_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Regular Checks
Periodically verify profiles match auth users:

```sql
-- Find users without profiles
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Find profile role mismatches with user metadata
SELECT
  p.email,
  p.role as profile_role,
  u.raw_user_meta_data->>'role' as metadata_role
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role != COALESCE(u.raw_user_meta_data->>'role', 'parent');
```

---

## Summary

✅ **Code fixed** - SignUpPage now uses `authStore.signUp()`
✅ **Trigger created** - Automatic profile creation for all new users
✅ **Build successful** - Ready to deploy

**Action needed:**
1. Run `supabase-profile-trigger.sql` in Supabase
2. Fix your existing account role (see "For Your Specific Case" above)
3. Deploy the updated code

---

## Files Modified

- `src/pages/auth/SignUpPage.jsx` - Now uses `authStore.signUp()`
- `supabase-profile-trigger.sql` - New trigger for automatic profiles
- `FIX_USER_ROLES.md` - This documentation

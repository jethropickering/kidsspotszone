# Supabase Email Confirmation Configuration

## Problem
When users click the email confirmation link after signing up, they're redirected to `localhost:3000` instead of your production URL, causing authentication errors.

## Solution
You need to configure Supabase to use your production URL for email redirects.

---

## Step 1: Update Supabase URL Configuration

### In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Update the **Site URL** to your production URL:
   ```
   https://kidsspotszone.com.au
   ```

3. Add your production URL to **Redirect URLs**:
   ```
   https://kidsspotszone.com.au/auth/callback
   https://kidsspotszone.com.au/**
   ```

4. For development, also add:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   ```

---

## Step 2: Update Email Templates

### In Supabase Dashboard:

1. Go to **Authentication** → **Email Templates**
2. For **Confirm signup** template, update the confirmation link to:
   ```
   {{ .ConfirmationURL }}
   ```
   This should automatically redirect to: `https://kidsspotszone.com.au/auth/callback#access_token=...`

3. **Optional**: Customize the email template with your branding:
   ```html
   <h2>Welcome to Kids Sports Zone!</h2>
   <p>Thanks for signing up. Please confirm your email address by clicking the button below:</p>
   <a href="{{ .ConfirmationURL }}" style="...">Confirm Email</a>
   ```

---

## Step 3: How the Flow Works

1. **User signs up** → Account created, confirmation email sent
2. **User clicks link** → Redirected to `/auth/callback` with token in URL hash
3. **AuthCallbackPage** → Processes token, gets user profile
4. **Redirect based on role:**
   - Venue Owner → `/dashboard/venue`
   - Admin → `/dashboard/admin`
   - Parent → `/dashboard`

---

## Step 4: Test the Flow

### Test Venue Owner Signup:
1. Sign up as venue owner with a real email
2. Check inbox for confirmation email
3. Click confirmation link
4. Should redirect to `/dashboard/venue`

### Test Parent Signup:
1. Sign up as parent
2. Check inbox for confirmation email
3. Click confirmation link
4. Should redirect to `/dashboard`

---

## Files Modified

- **Created**: `src/pages/auth/AuthCallbackPage.jsx` - Handles auth token processing
- **Updated**: `src/App.jsx` - Added `/auth/callback` route
- **Updated**: `src/pages/auth/SignUpPage.jsx` - Fixed venue owner redirect

---

## Environment Variables

Make sure your `.env` file has:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://kidsspotszone.com.au
```

---

## Troubleshooting

### Still redirecting to localhost?
- Clear browser cache
- Make sure Supabase Site URL is set to production URL
- Check that email template uses `{{ .ConfirmationURL }}` not a hardcoded URL

### "Authentication Error" shown?
- Check browser console for errors
- Verify Supabase redirect URLs include `/auth/callback`
- Make sure user's email is verified in Supabase dashboard

### User role not detected?
- Check that user metadata has `role` field
- Verify profile was created with correct role in `profiles` table
- Look at Supabase logs for any errors during signup

---

## Production Checklist

- [ ] Site URL set to `https://kidsspotszone.com.au`
- [ ] Redirect URLs include `/auth/callback`
- [ ] Email templates use `{{ .ConfirmationURL }}`
- [ ] Test signup flow with real email
- [ ] Verify venue owner redirects to `/dashboard/venue`
- [ ] Verify parent redirects to `/dashboard`
- [ ] Check email deliverability
- [ ] Monitor Supabase logs for errors

---

## Support

If you continue having issues:
1. Check Supabase Auth logs: **Authentication** → **Logs**
2. Check browser console for JavaScript errors
3. Verify email template configuration
4. Test with different email providers (Gmail, Outlook, etc.)

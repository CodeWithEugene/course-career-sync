# 🔧 Google OAuth Authentication Fix Guide

## Problem Identified
The OAuth error "Unable to exchange external code" occurs due to several configuration issues:

1. **Conflicting Supabase Projects**: You have two different Supabase projects in your environment files
2. **Wrong Environment Variable Names**: Supabase client expects `VITE_SUPABASE_PUBLISHABLE_KEY` but you have `VITE_SUPABASE_ANON_KEY`
3. **OAuth Redirect Configuration**: The redirect URL needs proper configuration

## ✅ Code Changes Made

### 1. Updated Auth.tsx
- Added proper error handling for OAuth flow
- Set redirect URL to `/dashboard` for successful authentication
- Added try-catch blocks for better error management

### 2. Updated App.tsx
- Enhanced auth state change handling
- Added automatic redirect to dashboard after successful sign-in
- Better error handling for OAuth events

## 🔧 Required Configuration Steps

### Step 1: Fix Environment Variables
Update your `.env.local` file with the correct values:

```env
VITE_SUPABASE_URL="https://owonfwuyrqwywgsjxrcl.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b25md3V5cnF3eXdnc2p4cmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzQzMTIsImV4cCI6MjA3NTA1MDMxMn0.qZdrYaI33xudf8pnANcvgzKuXQGKhQTxwYeFkpsh3js"
VITE_GOOGLE_CLIENT_ID="117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com"
```

**Important**: Make sure to use `VITE_SUPABASE_PUBLISHABLE_KEY` (not `VITE_SUPABASE_ANON_KEY`)

### Step 2: Configure Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `owonfwuyrqwywgsjxrcl`
3. Go to **Authentication** → **URL Configuration**
4. Add these **Redirect URLs**:
   ```
   https://course-career-sync.vercel.app/dashboard
   https://course-career-sync.vercel.app/auth
   http://localhost:8080/dashboard
   http://localhost:8080/auth
   ```

### Step 3: Configure Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com`
4. Add these **Authorized JavaScript origins**:
   ```
   https://course-career-sync.vercel.app
   http://localhost:8080
   ```
5. Add these **Authorized redirect URIs**:
   ```
   https://owonfwuyrqwywgsjxrcl.supabase.co/auth/v1/callback
   ```

### Step 4: Deploy and Test
1. Deploy your changes to Vercel
2. Test the authentication flow at: `https://course-career-sync.vercel.app/auth`
3. After successful Google sign-in, you should be redirected to the dashboard

## 🐛 Troubleshooting

### If you still get OAuth errors:
1. **Check browser console** for specific error messages
2. **Verify environment variables** are correctly set in Vercel dashboard
3. **Wait 5-10 minutes** after making Google Console changes (propagation delay)
4. **Clear browser cache** and try again

### Common Issues:
- **"Invalid redirect URI"**: Check Google Console redirect URIs
- **"Client ID not found"**: Verify environment variables
- **"Supabase auth error"**: Check Supabase redirect URLs

## 🎯 Expected Behavior After Fix
1. Click "Continue with Google" button
2. Google OAuth popup opens
3. Select your Google account
4. Popup closes automatically
5. You're redirected to `/dashboard`
6. No more "server_error" or "unexpected_failure" errors

## 📝 Notes
- The code changes ensure proper error handling and redirects
- Environment variables must match exactly (case-sensitive)
- Both Supabase and Google Console configurations are required
- Changes may take a few minutes to propagate through Google's systems

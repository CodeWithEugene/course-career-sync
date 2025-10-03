# 🔧 Environment Setup for OAuth Fix

## Current Issue
The OAuth error "Unable to exchange external code" is caused by environment variable mismatches and configuration issues.

## ✅ Required Environment Variables

### For .env.local (Local Development)
```env
VITE_SUPABASE_URL="https://owonfwuyrqwywgsjxrcl.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b25md3V5cnF3eXdnc2p4cmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzQzMTIsImV4cCI6MjA3NTA1MDMxMn0.qZdrYaI33xudf8pnANcvgzKuXQGKhQTxwYeFkpsh3js"
VITE_GOOGLE_CLIENT_ID="117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com"
```

### For Vercel (Production)
Set these environment variables in your Vercel dashboard:
- `VITE_SUPABASE_URL` = `https://owonfwuyrqwywgsjxrcl.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b25md3V5cnF3eXdnc2p4cmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzQzMTIsImV4cCI6MjA3NTA1MDMxMn0.qZdrYaI33xudf8pnANcvgzKuXQGKhQTxwYeFkpsh3js`
- `VITE_GOOGLE_CLIENT_ID` = `117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com`

## 🔧 Required Supabase Configuration

### 1. Supabase Dashboard Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to project: `owonfwuyrqwywgsjxrcl`
3. Go to **Authentication** → **URL Configuration**
4. Add these **Redirect URLs**:
   ```
   https://course-career-sync.vercel.app/dashboard
   https://course-career-sync.vercel.app/auth
   http://localhost:8080/dashboard
   http://localhost:8080/auth
   ```

### 2. Google OAuth Provider Setup
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable Google provider
4. Add your Google Client ID: `117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com`
5. Add your Google Client Secret (get this from Google Cloud Console)

## 🔧 Required Google Cloud Console Configuration

### 1. OAuth 2.0 Client ID Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com`
4. Click the edit (pencil) icon

### 2. Authorized JavaScript Origins
Add these origins:
```
https://course-career-sync.vercel.app
http://localhost:8080
```

### 3. Authorized Redirect URIs
Add these redirect URIs:
```
https://owonfwuyrqwywgsjxrcl.supabase.co/auth/v1/callback
```

## 🚀 Deployment Steps

### 1. Update Environment Variables
- Update your `.env.local` file with the correct values above
- Set the same variables in your Vercel dashboard

### 2. Configure Supabase
- Follow the Supabase configuration steps above
- Make sure the Google provider is properly configured

### 3. Configure Google Cloud Console
- Follow the Google Cloud Console configuration steps above
- Wait 5-10 minutes for changes to propagate

### 4. Deploy and Test
- Deploy your changes to Vercel
- Test the authentication flow at: `https://course-career-sync.vercel.app/auth`

## 🐛 Troubleshooting

### If you still get OAuth errors:
1. **Check browser console** for specific error messages
2. **Verify environment variables** are correctly set in Vercel
3. **Check Supabase logs** in the dashboard for authentication errors
4. **Verify Google Console** redirect URIs are exactly correct
5. **Wait 5-10 minutes** after making changes (propagation delay)

### Common Error Messages:
- **"Invalid redirect URI"**: Check Google Console redirect URIs
- **"Client ID not found"**: Verify environment variables
- **"Unable to exchange external code"**: Usually means Supabase/Google configuration mismatch

## ✅ Expected Behavior After Fix
1. Click "Continue with Google" button
2. Google OAuth popup opens
3. Select your Google account
4. Popup closes automatically
5. You're redirected to `/dashboard`
6. No more "server_error" or "unexpected_failure" errors

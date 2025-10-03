# 🔧 Supabase Configuration for Local Development

## Problem
Google OAuth redirects to production URL instead of localhost during development.

## Solution
Configure Supabase to allow localhost redirect URLs.

## Steps to Fix:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Navigate to your project: `zlfyuxnfjsgawemfrkwq`

### 2. Configure Authentication Settings
1. Go to **Authentication** → **URL Configuration**
2. In **Site URL**, add: `http://localhost:8080`
3. In **Redirect URLs**, add these URLs:
   ```
   http://localhost:8080/auth/callback
   http://localhost:8080/dashboard
   https://course-career-sync.lovable.app/auth/callback
   https://course-career-sync.lovable.app/dashboard
   ```

### 3. Google OAuth Provider Configuration
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Make sure the **Authorized redirect URIs** in your Google Cloud Console include:
   ```
   https://zlfyuxnfjsgawemfrkwq.supabase.co/auth/v1/callback
   ```

### 4. Test the Configuration
- After saving the changes, try Google OAuth login again
- Check the browser console for the redirect URL being used
- The OAuth flow should now redirect to `http://localhost:8080/auth/callback`

## Code Changes Made:
- ✅ Environment-based redirect URL detection
- ✅ Local development configuration in `.env.local`
- ✅ Dedicated auth callback route at `/auth/callback`
- ✅ Enhanced error handling and user feedback

## Notes:
- The code now automatically detects development vs production environment
- Local development uses `http://localhost:8080`
- Production continues to use the current domain
- Console logging added for debugging the redirect URL
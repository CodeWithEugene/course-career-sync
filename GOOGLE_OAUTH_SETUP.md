# 🔧 Google OAuth Setup Guide

## Overview
This application now uses direct Google OAuth authentication instead of Supabase.

## Google Cloud Console Configuration

### 1. Enable Google OAuth APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Library**
4. Enable the following APIs:
   - Google+ API
   - Google OAuth2 API

### 2. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: `SkillSync`
   - User support email: Your email
   - Developer contact information: Your email

### 3. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   ```
   http://localhost:8080/auth/callback
   https://course-career-sync.vercel.app/auth/callback
   ```

## Environment Configuration

### Development (.env.local)
```env
VITE_GOOGLE_CLIENT_ID="117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com"
VITE_GOOGLE_CLIENT_SECRET="c249533c55856405fd1945c880fafd64ea3e9db2231f09d1ca65f3156618de87"
VITE_LOCAL_REDIRECT_URL="http://localhost:8080"
VITE_PRODUCTION_URL="https://course-career-sync.vercel.app"
```

### Production (Vercel Environment Variables)
Set these in Vercel dashboard under Settings → Environment Variables:
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_SECRET`
- `VITE_PRODUCTION_URL`

## Authentication Flow

### 1. User Authentication
- User clicks "Continue with Google" button
- Redirected to Google OAuth consent screen
- After consent, redirected back to `/auth/callback`
- Authorization code exchanged for access token
- User information retrieved and stored in localStorage
- User redirected to dashboard

### 2. Session Management
- User data stored in localStorage:
  - `googleAuthToken`: OAuth access token
  - `userInfo`: User profile information (name, email, picture)
- Authentication checked on page load
- Auto-redirect to `/auth` if not authenticated

### 3. Sign Out
- Clears localStorage data
- Redirects to auth page

## Security Considerations

### Client Secret Exposure
⚠️ **Important**: The client secret is currently exposed in the frontend code. For production, consider:

1. **Backend Proxy**: Move token exchange to a backend service
2. **Serverless Function**: Use Vercel API routes for token exchange
3. **PKCE Flow**: Implement Proof Key for Code Exchange for enhanced security

### Recommended Backend Implementation
```javascript
// api/auth/google.js (Vercel serverless function)
export default async function handler(req, res) {
  const { code } = req.body;
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
    }),
  });
  
  const data = await tokenResponse.json();
  res.json(data);
}
```

## Files Modified

### Removed Supabase Dependencies
- ❌ `supabase.auth.signInWithOAuth()`
- ❌ `supabase.auth.onAuthStateChange()`
- ❌ Password-based authentication
- ❌ Email/password form fields

### New Google OAuth Implementation
- ✅ Direct Google OAuth URL construction
- ✅ Authorization code flow
- ✅ Token exchange in browser
- ✅ User info retrieval
- ✅ localStorage session management
- ✅ Environment-based redirect URLs

### Updated Components
- `src/pages/Auth.tsx` - Google-only authentication
- `src/pages/AuthCallback.tsx` - OAuth callback handler
- `src/pages/Dashboard.tsx` - New auth check
- `src/pages/Profile.tsx` - New auth check

## Testing

### Local Development
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:8080/auth`
3. Click "Continue with Google"
4. Complete OAuth flow
5. Should redirect to dashboard

### Production Testing
1. Deploy to Vercel
2. Navigate to: `https://course-career-sync.vercel.app/auth`
3. Test complete OAuth flow

## Troubleshooting

### Common Issues
1. **Redirect URI Mismatch**: Ensure URIs in Google Console match exactly
2. **Client ID/Secret**: Verify environment variables are set correctly
3. **CORS Errors**: Check Google Console configuration
4. **Token Exchange Fails**: Verify client secret is correct

### Debug Information
- Check browser console for OAuth URL
- Verify redirect URIs in network tab
- Check localStorage for stored tokens
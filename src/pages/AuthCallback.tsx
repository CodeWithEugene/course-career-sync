import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          toast({
            title: "Authentication Error",
            description: "There was an issue with Google authentication. Please try again.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          toast({
            title: "Authentication Error",
            description: "No authorization code received from Google.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Exchange the authorization code for an access token
        const response = await exchangeCodeForToken(code);
        
        if (response.success) {
          // Store user information
          localStorage.setItem('googleAuthToken', response.access_token);
          localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
          
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${response.userInfo.name}`,
          });
          
          navigate('/dashboard');
        } else {
          throw new Error(response.error || 'Failed to authenticate');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const isDevelopment = window.location.hostname === 'localhost';
      const localUrl = import.meta.env.VITE_LOCAL_REDIRECT_URL || 'http://localhost:8080';
      const productionUrl = import.meta.env.VITE_PRODUCTION_URL || 'https://course-career-sync.vercel.app';
      
      const redirectUri = isDevelopment 
        ? `${localUrl}/auth/callback`
        : `${productionUrl}/auth/callback`;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com';
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || 'c249533c55856405fd1945c880fafd64ea3e9db2231f09d1ca65f3156618de87';

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Failed to exchange code for token');
      }

      // Get user information using the access token
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userInfo = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      return {
        success: true,
        access_token: tokenData.access_token,
        userInfo: userInfo,
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing your Google sign-in...</p>
        <p className="text-sm text-muted-foreground">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
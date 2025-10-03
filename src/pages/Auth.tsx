import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "117053563877-pdor1rav4e9kgrea7p21e31h999q7tfj.apps.googleusercontent.com";

// Types for Google Identity Services
interface CredentialResponse {
  credential: string;
}

// Extend window type for Google API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: CredentialResponse) => void; }) => void;
          prompt: () => void;
        };
      };
    };
    handleCredentialResponse?: (response: CredentialResponse) => void;
  }
}

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    if (localStorage.getItem('googleAuthToken')) {
      navigate('/dashboard');
      return;
    }

    // Define global callback function
    window.handleCredentialResponse = (response: CredentialResponse) => {
      setLoading(true);
      try {
        const userInfo = parseJwt(response.credential);
        localStorage.setItem('googleAuthToken', response.credential);
        localStorage.setItem('userInfo', JSON.stringify({
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        }));
        
        toast({
          title: "Welcome!",
          description: `Successfully signed in as ${userInfo.name}`,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error handling credential response:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to process Google authentication.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: window.handleCredentialResponse,
        });
        setIsGoogleReady(true);
      } else {
         console.error("Google Identity Services library not loaded.");
         toast({
            title: "Initialization Error",
            description: "Could not load Google Sign-In. Please refresh the page.",
            variant: "destructive",
         });
      }
    };

    // Load Google Identity Services script
    if (!document.getElementById('google-gsi-client')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    // Cleanup the global function when the component unmounts
    return () => {
      delete window.handleCredentialResponse;
    };

  }, [navigate, toast]);

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  };

  const handleGoogleSignIn = () => {
    if (!isGoogleReady || !window.google || !window.google.accounts) {
      toast({
        title: "Google Sign-In Not Ready",
        description: "Please wait a moment for Google services to load and try again.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    window.google.accounts.id.prompt();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">SkillSync</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription>Choose your preferred sign-in method</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={loading || !isGoogleReady}
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  "Redirecting..."
                ) : !isGoogleReady ? (
                  "Loading..."
                ) : (
                  <>
                    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.88 1.62-4.56 0-8.28-3.72-8.28-8.28s3.72-8.28 8.28-8.28c2.48 0 4.2.92 5.56 2.16l2.6-2.6C19.02 1.44 16.08 0 12.48 0 5.88 0 .48 5.4.48 12s5.4 12 12 12c3.24 0 5.96-1.08 7.92-3.08 2.04-2.04 2.64-5.04 2.64-8.16 0-.72-.08-1.36-.2-1.92h-10.4z"
                      ></path>
                    </svg>
                    Continue with Google
                  </>
                )}
              </div>
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
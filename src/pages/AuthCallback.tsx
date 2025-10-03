import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: "There was an issue completing your sign-in. Please try again.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (data.session) {
          toast({
            title: "Welcome!",
            description: "You've successfully signed in with Google.",
          });
          navigate('/dashboard');
        } else {
          // No session, redirect to auth
          navigate('/auth');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing your sign-in...</p>
        <p className="text-sm text-muted-foreground">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async (response: any) => {
    setLoading(true);
    console.log("Google Sign-In response:", response);
    const { credential } = response;
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });

    if (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  useEffect(() => {
    const google = window.google;
    if (google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large", width: "350" }
      );
    }
  }, []);

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
            <div id="google-signin-button" className="w-full flex justify-center"></div>
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
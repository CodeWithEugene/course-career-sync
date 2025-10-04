import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogOut, ArrowLeft, Share2, Award, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { parseJwt } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  name: string;
  confidence: number;
  category: string;
  relatedCourses: string[];
}

interface CareerMatch {
  career: string;
  matchedSkills: string[];
  percentageFit: number;
  missingSkills?: string[];
  recommendations?: string;
}

const Profile = () => {
  const [user, setUser] = useState<{id: string, name: string, email: string, picture?: string} | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [careerMatch, setCareerMatch] = useState<CareerMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserAndAnalysis = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email || ''
      });

      // Fetch the latest analysis
      try {
        const { data, error } = await supabase
          .from('skill_analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching analysis:', error);
          toast({
            title: "No analysis found",
            description: "Please complete an analysis from the dashboard first.",
          });
          navigate('/dashboard');
          return;
        }

        if (data) {
          setSkills(data.skills as unknown as Skill[]);
          setCareerMatch(data.career_match as unknown as CareerMatch);
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndAnalysis();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate('/auth');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Your skill portfolio link has been copied to clipboard.",
    });
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!careerMatch || skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Analysis Found</CardTitle>
            <CardDescription>
              Please complete a coursework analysis from the dashboard first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SkillSync</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{user.name || user.email}</h1>
            <p className="text-muted-foreground">Student Skill Portfolio</p>
          </div>

          {/* Career Match */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Career Path Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold">{careerMatch.career}</span>
                    <span className="text-3xl font-bold text-primary">
                      {careerMatch.percentageFit}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${careerMatch.percentageFit}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Matched Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {careerMatch.matchedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {careerMatch.missingSkills && careerMatch.missingSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills to Develop:</p>
                    <div className="flex flex-wrap gap-2">
                      {careerMatch.missingSkills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {careerMatch.recommendations && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Recommendations:</p>
                    <p className="text-sm text-muted-foreground">{careerMatch.recommendations}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Skill Badges</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="outline">{skill.category}</Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(skill.confidence * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">confidence</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Related Courses:</p>
                        <div className="flex flex-wrap gap-2">
                          {skill.relatedCourses.map((course) => (
                            <Badge key={course} variant="secondary" className="text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
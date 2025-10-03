import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, LogOut, ArrowLeft, Share2, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockSkills = [
  {
    name: "Data Visualization with Python",
    confidence: 0.87,
    category: "Technical",
    relatedCourses: ["Statistics 101", "Intro to Data Science"]
  },
  {
    name: "Statistical Analysis",
    confidence: 0.92,
    category: "Technical",
    relatedCourses: ["Statistics 101", "Advanced Statistics"]
  },
  {
    name: "Problem Solving",
    confidence: 0.78,
    category: "Soft Skills",
    relatedCourses: ["Computer Science Fundamentals"]
  },
  {
    name: "Project Management",
    confidence: 0.65,
    category: "Professional",
    relatedCourses: ["Software Engineering"]
  }
];

const mockCareerMatch = {
  career: "Data Analyst",
  matchedSkills: ["Data Visualization with Python", "Statistical Analysis"],
  percentageFit: 82
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Your skill portfolio link has been copied to clipboard.",
    });
  };

  if (!user) return null;

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
          <div className="flex items-center gap-4">
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
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{user.email}</h1>
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
                    <span className="text-2xl font-bold">{mockCareerMatch.career}</span>
                    <span className="text-3xl font-bold text-primary">
                      {mockCareerMatch.percentageFit}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${mockCareerMatch.percentageFit}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Matched Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {mockCareerMatch.matchedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Skill Badges</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mockSkills.map((skill, index) => (
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
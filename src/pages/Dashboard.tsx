import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Upload, LogOut, Target, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const careers = [
  "Data Scientist",
  "Data Analyst", 
  "Software Engineer",
  "Project Manager",
  "Product Manager",
  "UX Designer",
  "Marketing Specialist",
  "Business Analyst",
];

const Dashboard = () => {
  const [user, setUser] = useState<{id: string, email: string} | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [courseworkText, setCourseworkText] = useState("");
  const [careerPath, setCareerPath] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email || ''
      });
    };

    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate('/auth');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Read file content for text files
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        const text = await selectedFile.text();
        setCourseworkText(text);
      } else {
        toast({
          title: "File type note",
          description: "For best results, use .txt files or paste your content directly.",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!user) return;
    
    if (!courseworkText || !careerPath) {
      toast({
        title: "Missing information",
        description: "Please provide coursework content and select a career path.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analysis started!",
        description: "AI is analyzing your coursework...",
      });

      const { data, error } = await supabase.functions.invoke('analyze-coursework', {
        body: {
          courseworkContent: courseworkText,
          careerPath: careerPath
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('Analysis result:', data);

      // Save the analysis to the database
      const { error: dbError } = await supabase
        .from('skill_analyses')
        .insert({
          user_id: user.id,
          career_path: careerPath,
          coursework_content: courseworkText,
          skills: data.skills,
          career_match: data.careerMatch
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast({
        title: "Analysis complete!",
        description: "Your skill portfolio has been generated.",
      });

      navigate('/profile');
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">SkillSync</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Map Your Learning Journey</h1>
            <p className="text-muted-foreground">
              Upload your coursework and discover how your skills align with your career goals
            </p>
          </div>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload or Paste Coursework
              </CardTitle>
              <CardDescription>
                Upload a .txt file or paste your syllabus, notes, or course materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload File (Optional)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="coursework-text">Or Paste Content Here</Label>
                <Textarea
                  id="coursework-text"
                  placeholder="Paste your course syllabus, learning outcomes, topics covered, assignments, etc."
                  value={courseworkText}
                  onChange={(e) => setCourseworkText(e.target.value)}
                  className="mt-2 min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Career Path Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Select Career Path
              </CardTitle>
              <CardDescription>
                Choose the career you want to align your skills with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={careerPath} onValueChange={setCareerPath}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a career path" />
                </SelectTrigger>
                <SelectContent>
                  {careers.map((career) => (
                    <SelectItem key={career} value={career}>
                      {career}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Analyze Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze & Generate Portfolio
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
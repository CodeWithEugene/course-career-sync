import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Sparkles, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [user, setUser] = useState<{id: string, name: string, email: string, picture?: string} | null>(null);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const userToken = localStorage.getItem('googleAuthToken');
    const userInfoStr = localStorage.getItem('userInfo');
    
    if (!userToken || !userInfoStr) {
      navigate('/auth');
      return;
    }

    try {
      const userInfo = JSON.parse(userInfoStr);
      setUser(userInfo);
    } catch (error) {
      console.error('Error parsing user info:', error);
      navigate('/auth');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('googleAuthToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate('/auth');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !selectedCareer) {
      toast({
        title: "Missing information",
        description: "Please upload a file and select a career path.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing...",
      description: "Your coursework is being analyzed. This may take a moment.",
    });

    // Here you would implement the actual file upload and AI processing
    // For now, we'll just show a success message
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile
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
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back, {user.name}!</h1>
            <p className="text-muted-foreground">
              Upload your coursework to discover your skills
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Map Your Learning</CardTitle>
              <CardDescription>
                Upload your unit notes or syllabus and select your target career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="career">Target Career Path</Label>
                  <Select value={selectedCareer} onValueChange={setSelectedCareer}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload Coursework</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="file"
                      className="cursor-pointer text-sm text-muted-foreground"
                    >
                      {file ? (
                        <span className="text-primary font-medium">{file.name}</span>
                      ) : (
                        <>
                          Click to upload or drag and drop
                          <br />
                          PDF, DOCX or TXT (max 10MB)
                        </>
                      )}
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze My Skills
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
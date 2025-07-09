"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Rocket, Award, Lightbulb, UserCheck, CheckCircle2, FolderKanban, ArrowRight, Sparkles } from "lucide-react";

const ALL_FRONTEND_ROLES = [
  "Frontend Developer",
  "Junior Frontend Developer",
  "Senior Frontend Developer",
  "React Developer",
  "Vue.js Developer",
  "Angular Developer",
  "JavaScript Engineer",
  "UI Engineer",
  "Web Developer",
  "Web Application Developer",
  "Frontend Architect",
  "UI/UX Developer",
  "Accessibility Engineer",
  "Mobile Web Developer",
  "Frontend Team Lead",
  "Frontend Technical Lead",
  "Frontend Software Engineer",
  "Frontend Consultant",
  "Frontend QA Engineer",
  "Frontend Performance Engineer",
  "Frontend DevOps Engineer",
  "Frontend Intern",
  "Frontend Freelancer",
  "Frontend Contractor",
  "Frontend Product Engineer",
  "Frontend Platform Engineer",
  "Frontend Integration Engineer",
  "Frontend Test Engineer",
  "Frontend Automation Engineer",
  "Frontend Support Engineer",
  "Frontend Solutions Engineer",
  "Frontend Delivery Manager",
  "Frontend Project Manager",
  "Frontend Scrum Master",
  "Frontend Mentor",
  "Frontend Trainer",
  "Frontend Coach",
  "Frontend Evangelist",
  "Frontend Community Manager",
  "Frontend Documentation Engineer",
  "Frontend Release Engineer",
  "Frontend Build Engineer",
  "Frontend Security Engineer",
  "Frontend Analytics Engineer",
  "Frontend SEO Specialist",
  "Frontend A/B Testing Engineer",
  "Frontend Growth Engineer",
  "Frontend Experimentation Engineer",
  "Frontend Researcher",
  "Frontend Designer",
  "Frontend Prototyper",
  "Frontend Accessibility Specialist",
  "Frontend Animation Engineer",
  "Frontend Game Developer"
];

const ALL_BACKEND_ROLES = [
  "Backend Developer",
  "Junior Backend Developer",
  "Senior Backend Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Ruby Developer",
  "Go Developer",
  "API Engineer",
  "Database Engineer",
  "Backend Architect",
  "DevOps Engineer",
  "Cloud Backend Engineer",
  "Backend Team Lead",
  "Backend Technical Lead",
  "Backend Software Engineer",
  "Backend Consultant",
  "Backend QA Engineer",
  "Backend Performance Engineer",
  "Backend Security Engineer",
  "Backend Intern",
  "Backend Freelancer",
  "Backend Contractor",
  "Backend Product Engineer",
  "Backend Platform Engineer",
  "Backend Integration Engineer",
  "Backend Test Engineer",
  "Backend Automation Engineer",
  "Backend Support Engineer",
  "Backend Solutions Engineer",
  "Backend Delivery Manager",
  "Backend Project Manager",
  "Backend Scrum Master",
  "Backend Mentor",
  "Backend Trainer",
  "Backend Coach",
  "Backend Evangelist",
  "Backend Community Manager",
  "Backend Documentation Engineer",
  "Backend Release Engineer",
  "Backend Build Engineer",
  "Backend Analytics Engineer",
  "Backend Researcher"
];

const ALL_DATA_SCIENCE_ROLES = [
  "Data Scientist",
  "Junior Data Scientist",
  "Senior Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Analyst",
  "Research Scientist",
  "Deep Learning Engineer",
  "NLP Engineer",
  "Computer Vision Engineer",
  "Data Science Team Lead",
  "Data Science Manager",
  "Data Science Consultant",
  "Data Science Intern",
  "Data Science Freelancer",
  "Data Science Product Manager",
  "Data Science Researcher",
  "Business Intelligence Analyst",
  "Quantitative Analyst",
  "Data Engineer",
  "Big Data Engineer",
  "Statistical Analyst"
];

const ALL_PRODUCT_MANAGER_ROLES = [
  "Product Manager",
  "Associate Product Manager",
  "Senior Product Manager",
  "Technical Product Manager",
  "Product Owner",
  "Product Lead",
  "Group Product Manager",
  "Director of Product",
  "VP of Product",
  "Chief Product Officer",
  "Product Analyst",
  "Product Strategist",
  "Product Operations Manager",
  "Product Marketing Manager",
  "Product Designer",
  "Product Researcher",
  "Product Intern",
  "Product Consultant"
];

const GENERIC_ROLES = [
  "Intern",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "Consultant",
  "Specialist",
  "Freelancer"
];

function getRolesForGoal(goal) {
  if (!goal) return GENERIC_ROLES;
  const g = goal.toLowerCase();
  if (g.includes("frontend")) return ALL_FRONTEND_ROLES;
  if (g.includes("backend")) return ALL_BACKEND_ROLES;
  if (g.includes("data scientist") || g.includes("data science")) return ALL_DATA_SCIENCE_ROLES;
  if (g.includes("product manager") || g.includes("product management")) return ALL_PRODUCT_MANAGER_ROLES;
  // For all other goals, just show the generic roles
  return GENERIC_ROLES;
}

const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The future depends on what you do today.",
  "Opportunities don't happen, you create them.",
  "Dream big and dare to fail.",
  "Your only limit is your mind.",
  "Every accomplishment starts with the decision to try.",
  "Don't watch the clock; do what it does. Keep going.",
  "Great things never come from comfort zones.",
  "Push yourself, because no one else is going to do it for you.",
  "Believe you can and you're halfway there."
];

function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

const STAGE_LABELS = [
  "Start",
  "Learn Skills",
  "Build Projects",
  "Apply for Roles",
  "Achieve Goal"
];
const STAGE_ICONS = [
  <Flame className="w-6 h-6 text-orange-500" />, 
  <Lightbulb className="w-6 h-6 text-yellow-500 animate-pulse" />, 
  <FolderKanban className="w-6 h-6 text-green-500 animate-bounce" />, 
  <UserCheck className="w-6 h-6 text-blue-500 animate-pulse" />, 
  <Award className="w-6 h-6 text-purple-500 animate-bounce" />
];

export default function CareerPathPlannerPage() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");
  const [stage, setStage] = useState(0); // 0 = Start

  useEffect(() => {
    setQuote(getRandomQuote());
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        title: `To become a ${goal || "Frontend Developer"} in 1 year:`,
        skills: [
          "Learn React and modern JavaScript",
          "Master CSS and responsive design",
          "Understand version control (Git)",
          "Get familiar with testing frameworks",
        ],
        projects: [
          "Build a personal portfolio website",
          "Create a task manager app",
          "Contribute to open source on GitHub",
        ],
        roles: getRolesForGoal(goal),
      });
      setLoading(false);
      setStage(0); // Start at 'Start' after submit
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto py-20">
      <Card>
        <CardHeader>
          <CardTitle>AI Career Path Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block font-medium">What job do you want in 1 year?</label>
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Planning..." : "Get My Roadmap"}
            </Button>
          </form>
          {result && (
            <div className="mt-8 space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-primary">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
                {result.title}
              </h3>
              {/* Skills Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-blue-500" />
                  <span className="font-semibold text-lg">Skills to Learn</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-base px-3 py-2 shadow-md">{skill}</Badge>
                  ))}
                </div>
              </div>
              {/* Projects Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FolderKanban className="text-green-500" />
                  <span className="font-semibold text-lg">Project Ideas</span>
                </div>
                <ol className="relative border-l border-gray-300 ml-4">
                  {result.projects.map((proj, idx) => (
                    <li key={proj} className="mb-6 ml-6">
                      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-4 ring-white">
                        <Rocket className="w-4 h-4 text-green-600 animate-bounce" />
                      </span>
                      <h4 className="font-semibold text-green-800">{proj}</h4>
                      <p className="text-xs text-muted-foreground">Month {idx + 1}-{idx + 2}</p>
                    </li>
                  ))}
                </ol>
              </div>
              {/* Motivational Quote */}
              <div className="mt-8 flex items-center gap-2 p-4 bg-purple-50 rounded shadow-inner">
                <Lightbulb className="w-6 h-6 text-purple-400 animate-pulse" />
                <span className="italic text-purple-700">{quote}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
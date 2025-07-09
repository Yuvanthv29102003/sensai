"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const CAREER_PATHWAYS = {
  "software-development": [
    { label: "Junior Developer", color: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Developer", color: "bg-blue-200", iconColor: "text-blue-700" },
    { label: "Senior Developer", color: "bg-blue-300", iconColor: "text-blue-800" },
    { label: "Lead Engineer", color: "bg-purple-200", iconColor: "text-purple-700" },
  ],
  "data-science": [
    { label: "Data Analyst", color: "bg-green-100", iconColor: "text-green-600" },
    { label: "Data Scientist", color: "bg-green-200", iconColor: "text-green-700" },
    { label: "Senior Data Scientist", color: "bg-green-300", iconColor: "text-green-800" },
    { label: "Data Science Manager", color: "bg-purple-200", iconColor: "text-purple-700" },
  ],
  "product-management": [
    { label: "Associate Product Manager", color: "bg-yellow-100", iconColor: "text-yellow-600" },
    { label: "Product Manager", color: "bg-yellow-200", iconColor: "text-yellow-700" },
    { label: "Senior Product Manager", color: "bg-yellow-300", iconColor: "text-yellow-800" },
    { label: "Director of Product", color: "bg-purple-200", iconColor: "text-purple-700" },
  ],
  // Add more as needed
};
const GENERIC_PATHWAY = [
  { label: "Entry Level", color: "bg-gray-100", iconColor: "text-gray-600" },
  { label: "Mid Level", color: "bg-gray-200", iconColor: "text-gray-700" },
  { label: "Senior", color: "bg-gray-300", iconColor: "text-gray-800" },
  { label: "Lead", color: "bg-purple-200", iconColor: "text-purple-700" },
];

const MOCK_ROLES = [
  "Junior Developer",
  "Developer",
  "Senior Developer",
  "Lead Engineer",
  "Data Analyst",
  "Data Scientist",
  "Senior Data Scientist",
  "Data Science Manager",
  "Product Manager",
  "Senior Product Manager",
  "Director of Product"
];
const MOCK_SALARIES = {
  "Junior Developer": { min: 50000, median: 65000, max: 80000 },
  "Developer": { min: 70000, median: 90000, max: 120000 },
  "Senior Developer": { min: 100000, median: 130000, max: 160000 },
  "Lead Engineer": { min: 130000, median: 160000, max: 200000 },
  "Data Analyst": { min: 60000, median: 80000, max: 100000 },
  "Data Scientist": { min: 90000, median: 120000, max: 150000 },
  "Senior Data Scientist": { min: 120000, median: 150000, max: 180000 },
  "Data Science Manager": { min: 140000, median: 180000, max: 220000 },
  "Product Manager": { min: 90000, median: 120000, max: 150000 },
  "Senior Product Manager": { min: 130000, median: 160000, max: 200000 },
  "Director of Product": { min: 160000, median: 200000, max: 250000 }
};

const MOCK_LOCATIONS = ["Global", "USA", "India", "UK", "Germany", "Canada"];
const MOCK_EXPERIENCE = ["All", "0-2 years", "3-5 years", "6-10 years", "10+ years"];
const MOCK_SUB_INDUSTRIES = ["All", "Web Development", "Data Science", "Product Management"];

const MOCK_RESOURCES = {
  "React": "https://react.dev/learn",
  "JavaScript": "https://javascript.info/",
  "Data Analysis": "https://www.coursera.org/specializations/data-analysis",
  "Product Management": "https://www.productschool.com/",
  // Add more as needed
};

const MOCK_COMPANIES = {
  "Web Development": [
    { name: "Google", logo: "/logo.png", location: "Mountain View, CA", careers: "https://careers.google.com/" },
    { name: "Meta", logo: "/logo.png", location: "Menlo Park, CA", careers: "https://www.metacareers.com/" },
    { name: "Shopify", logo: "/logo.png", location: "Remote", careers: "https://www.shopify.com/careers" },
  ],
  "Data Science": [
    { name: "IBM", logo: "/logo.png", location: "Armonk, NY", careers: "https://www.ibm.com/employment/" },
    { name: "Airbnb", logo: "/logo.png", location: "San Francisco, CA", careers: "https://careers.airbnb.com/" },
    { name: "Spotify", logo: "/logo.png", location: "Stockholm, Sweden", careers: "https://www.spotifyjobs.com/" },
  ],
  "Product Management": [
    { name: "Microsoft", logo: "/logo.png", location: "Redmond, WA", careers: "https://careers.microsoft.com/" },
    { name: "Atlassian", logo: "/logo.png", location: "Sydney, Australia", careers: "https://www.atlassian.com/company/careers" },
    { name: "Stripe", logo: "/logo.png", location: "Remote", careers: "https://stripe.com/jobs" },
  ],
  "All": [
    { name: "Google", logo: "/logo.png", location: "Mountain View, CA", careers: "https://careers.google.com/" },
    { name: "IBM", logo: "/logo.png", location: "Armonk, NY", careers: "https://www.ibm.com/employment/" },
    { name: "Microsoft", logo: "/logo.png", location: "Redmond, WA", careers: "https://careers.microsoft.com/" },
  ],
};

const MOCK_NEWS = {
  "Web Development": [
    { title: "React 19 Released with New Features", url: "#", date: "2024-06-01", source: "TechCrunch" },
    { title: "Next.js 15: What’s New?", url: "#", date: "2024-05-20", source: "The Verge" },
    { title: "WebAssembly Gains Traction in Production", url: "#", date: "2024-05-10", source: "Hacker News" },
  ],
  "Data Science": [
    { title: "AI Outperforms Humans in Data Analysis", url: "#", date: "2024-06-02", source: "Wired" },
    { title: "Python Remains Top Language for Data Science", url: "#", date: "2024-05-18", source: "KDnuggets" },
    { title: "Big Data Trends in 2024", url: "#", date: "2024-05-05", source: "Forbes" },
  ],
  "Product Management": [
    { title: "Agile Product Management in 2024", url: "#", date: "2024-06-03", source: "Product Hunt" },
    { title: "Top PM Tools Compared", url: "#", date: "2024-05-22", source: "PM Review" },
    { title: "How AI is Changing Product Roadmaps", url: "#", date: "2024-05-12", source: "TechCrunch" },
  ],
  "All": [
    { title: "Tech Hiring Surges in 2024", url: "#", date: "2024-06-04", source: "Reuters" },
    { title: "Remote Work: The New Normal", url: "#", date: "2024-05-25", source: "BBC" },
    { title: "Upskilling for the Future", url: "#", date: "2024-05-15", source: "Harvard Business Review" },
  ],
};

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  // Salary Comparison Tool state
  const [role1, setRole1] = useState(MOCK_ROLES[0]);
  const [role2, setRole2] = useState(MOCK_ROLES[1]);
  const comparisonData = [
    { role: role1, ...MOCK_SALARIES[role1] },
    { role: role2, ...MOCK_SALARIES[role2] }
  ];

  // Filtering state
  const [location, setLocation] = useState(MOCK_LOCATIONS[0]);
  const [experience, setExperience] = useState(MOCK_EXPERIENCE[0]);
  const [subIndustry, setSubIndustry] = useState(MOCK_SUB_INDUSTRIES[0]);

  // For demo, filter salaryData and topSkills by subIndustry (mock logic)
  const filteredSalaryData = subIndustry === "All"
    ? salaryData
    : salaryData.filter((d) =>
        (subIndustry === "Web Development" && d.name.toLowerCase().includes("developer")) ||
        (subIndustry === "Data Science" && d.name.toLowerCase().includes("data")) ||
        (subIndustry === "Product Management" && d.name.toLowerCase().includes("product"))
      );
  const filteredTopSkills = subIndustry === "All"
    ? insights.topSkills
    : insights.topSkills.filter((s) =>
        (subIndustry === "Web Development" && s.toLowerCase().includes("js")) ||
        (subIndustry === "Data Science" && s.toLowerCase().includes("data")) ||
        (subIndustry === "Product Management" && s.toLowerCase().includes("product"))
      );

  // Skill Gap Analysis state
  const [userSkills, setUserSkills] = useState("");
  const userSkillList = userSkills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const missingSkills = filteredTopSkills.filter(
    (skill) => !userSkillList.includes(skill.toLowerCase())
  );

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // Remove all Top Companies related state, useEffect, and JSX.

  // News state
  const [newsList, setNewsList] = useState(MOCK_NEWS[subIndustry] || MOCK_NEWS["All"]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // Fetch news based on sub-industry
  const fetchNews = async (industry) => {
    setNewsLoading(true);
    setNewsError(null);
    
    try {
      // Option 1: Google News RSS (requires backend proxy due to CORS)
      const response = await fetch(`/api/news?industry=${encodeURIComponent(industry)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNewsList(data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNewsError('Failed to load news. Please try again later.');
      // Fallback to mock data
      setNewsList(MOCK_NEWS[industry] || MOCK_NEWS["All"]);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch news when sub-industry changes
  useEffect(() => {
    fetchNews(subIndustry);
  }, [subIndustry]);

  return (
    <div className="space-y-6">
      {/* Interactive Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold mb-1">Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)} className="border rounded px-2 py-1">
                {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Experience</label>
              <select value={experience} onChange={e => setExperience(e.target.value)} className="border rounded px-2 py-1">
                {MOCK_EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Sub-Industry</label>
              <select value={subIndustry} onChange={e => setSubIndustry(e.target.value)} className="border rounded px-2 py-1">
                {MOCK_SUB_INDUSTRIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Comparison Tool */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Comparison Tool</CardTitle>
          <CardDescription>
            Compare salaries for two roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Role 1</label>
              <select value={role1} onChange={e => setRole1(e.target.value)} className="border rounded px-2 py-1">
                {MOCK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Role 2</label>
              <select value={role2} onChange={e => setRole2(e.target.value)} className="border rounded px-2 py-1">
                {MOCK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary" />
                <Bar dataKey="max" fill="#475569" name="Max Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {filteredTopSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
          <CardDescription>
            See which in-demand skills you’re missing and get resources to learn them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">Your Current Skills (comma-separated)</label>
            <input
              type="text"
              value={userSkills}
              onChange={e => setUserSkills(e.target.value)}
              placeholder="e.g. React, JavaScript, Data Analysis"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          {missingSkills.length > 0 ? (
            <div>
              <div className="mb-2 font-semibold text-sm">Missing In-Demand Skills:</div>
              <ul className="list-disc ml-6 space-y-2">
                {missingSkills.map(skill => (
                  <li key={skill}>
                    <span className="font-medium">{skill}</span>
                    {MOCK_RESOURCES[skill] && (
                      <>
                        {" "}
                        <a href={MOCK_RESOURCES[skill]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Learn</a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-green-600 font-semibold">You have all the top skills for this industry!</div>
          )}
        </CardContent>
      </Card>

      {/* Industry News */}
      <Card className="mt-6 border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle>
            <span className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h2l2-2h4l2 2h2a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
              Industry News
            </span>
          </CardTitle>
          <CardDescription>
            Latest updates in {subIndustry !== "All" ? subIndustry : "the industry"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {newsLoading ? (
            <p>Loading news...</p>
          ) : newsError ? (
            <p className="text-red-500">{newsError}</p>
          ) : (
            <ul className="space-y-3">
              {newsList.map((news, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mt-1 mr-3 text-blue-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7zm-8 3a3 3 0 100-6 3 3 0 000 6z" /></svg>
                  </span>
                  <div>
                    <a href={news.url} className="font-medium text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">{news.title}</a>
                    <div className="text-xs text-gray-500">{news.date} &middot; {news.source}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSalaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Pathways */}
      <Card>
        <CardHeader>
          <CardTitle>Career Pathways</CardTitle>
          <CardDescription>
            Typical career progressions in this industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            // Try to match industry to a pathway
            let pathway = GENERIC_PATHWAY;
            if (insights.industry) {
              // Normalize industry string for matching
              const key = insights.industry.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              if (CAREER_PATHWAYS[key]) pathway = CAREER_PATHWAYS[key];
            }
            return (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-4">
                  {pathway.map((step, idx) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center">
                        <span className={`${step.color} p-2 rounded-full`}><BriefcaseIcon className={`w-6 h-6 ${step.iconColor}`} /></span>
                        <span className="text-xs mt-1 whitespace-nowrap">{step.label}</span>
                      </div>
                      {idx < pathway.length - 1 && (
                        <span className="text-2xl text-muted-foreground">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
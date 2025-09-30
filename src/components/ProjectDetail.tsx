import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, TrendingUp, Calendar, DollarSign, 
  Target, AlertCircle, CheckCircle2, Upload, Send,
  FileText, BarChart3, Clock, Users
} from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const projectName = projectId === "1" ? "NYC Tower" : 
                      projectId === "2" ? "Riverside Apartments" : "New Project";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Tabs */}
      <div className="bg-card border-b">
        <div className="container px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b-0 h-auto p-0 space-x-1">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Design Studio
              </TabsTrigger>
              <TabsTrigger 
                value="5d" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                5D
              </TabsTrigger>
              <TabsTrigger 
                value="automation" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Automation Hub
              </TabsTrigger>
              <TabsTrigger 
                value="procurement" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Procurement
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Data Engine
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Welcome Varun to {projectName}
            </h1>
            <p className="text-sm text-muted-foreground">Project Overview • AI summary</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Compliance Check</Button>
            <Button variant="outline" size="sm">Simulate Delay</Button>
            <Button variant="outline" size="sm">Collapse</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-primary">
                  <FileText className="h-4 w-4" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium">P-NYC-2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">Healthcare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">120,000 sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved Budget</span>
                  <span className="font-medium">$2.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Completion</span>
                  <span className="font-medium">Q4 2025</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Phase */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-primary">
                  <Target className="h-4 w-4" />
                  Project Phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Conceptual Design</span>
                    <span>Schematic</span>
                    <span>Detailed Design</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Current: Schematic</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-primary">
                  <Calendar className="h-4 w-4" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">•</span>
                    <span>Schematic freeze (Thu)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground">•</span>
                    <span>ZEB study draft (Mon)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Ask about KPIs, risks, schedules, or generate a report.</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Button variant="outline" size="sm" className="text-xs">SPI/CPI</Button>
                  <Button variant="outline" size="sm" className="text-xs">Budget</Button>
                  <Button variant="outline" size="sm" className="text-xs">Schedule</Button>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., Summarize risks and suggest mitigations" 
                    className="text-sm"
                  />
                  <Button size="sm" className="bg-construction-primary shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            {/* Signals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-warning">
                  <AlertTriangle className="h-4 w-4" />
                  Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cost risk 1 (steel): schedule slack 3d. I can run a what-if now.
                </p>
              </CardContent>
            </Card>

            {/* Key KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-primary">
                  <BarChart3 className="h-4 w-4" />
                  Key KPIs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Metric</span>
                    <span className="text-muted-foreground">Value</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-construction-success">Budget Utilization</span>
                    <span className="text-sm font-bold">107%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-construction-primary">Schedule Variance</span>
                    <span className="text-sm font-bold">+5 days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-construction-primary">Schedule Performance Index (SPI)</span>
                    <span className="text-sm font-bold">0.92</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-construction-warning">Cost Performance Index (CPI)</span>
                    <span className="text-sm font-bold">0.95</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-destructive">Critical Risks</span>
                    <span className="text-sm font-bold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Completed Milestone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-construction-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Previous Completed Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Schematic approved</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Alice replied to RH-102 (2h ago)</li>
                  <li>Bob uploaded Design v12 (4h ago)</li>
                  <li>Chen drafted PO: Steel (1d ago)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Project Charter & Vision */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Charter & Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Access the project's guiding principles, scope, and long-term vision.
                </p>
                <Button className="w-full bg-construction-primary">Open Charter</Button>
              </CardContent>
            </Card>

            {/* Required Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Information & Working version of files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span>$2.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Design File:</span>
                  <span>v12.dwg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule Target:</span>
                  <span>Q4 2025</span>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop files here or click to upload
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Charts Row */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {/* Design Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Design Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--construction-grid))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="hsl(var(--construction-primary))"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.74)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-construction-primary">74%</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Open</Button>
            </CardContent>
          </Card>

          {/* Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost (Budget vs Anticipated vs Committed)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-end justify-around gap-2 py-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 bg-construction-primary rounded-t" style={{ height: '80px' }}></div>
                  <span className="text-xs text-muted-foreground">800</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 bg-construction-primary rounded-t" style={{ height: '100px' }}></div>
                  <span className="text-xs text-muted-foreground">1000</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 bg-construction-primary rounded-t" style={{ height: '85px' }}></div>
                  <span className="text-xs text-muted-foreground">850</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Open</Button>
            </CardContent>
          </Card>

          {/* Schedule Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Schedule (Baseline vs Actual)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 relative py-4">
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--construction-grid))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points="0,90 50,70 100,50 150,35 200,20"
                  />
                  <polyline
                    fill="none"
                    stroke="hsl(var(--construction-primary))"
                    strokeWidth="2"
                    points="0,85 50,65 100,48 150,32 200,18"
                  />
                </svg>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Open</Button>
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">last used</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Weekly Overview</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cost Drift</span>
                  <span className="text-xs text-muted-foreground">XLSX</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Open</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
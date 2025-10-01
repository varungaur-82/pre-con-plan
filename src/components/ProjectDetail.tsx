import { useState } from "react";
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
  FileText, BarChart3, Clock, Users, PanelRightClose, PanelRightOpen
} from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";
import { DesignStudio } from "./DesignStudio";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const projectName = projectId === "1" ? "NYC Tower" : 
                      projectId === "2" ? "Riverside Apartments" : "New Project";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="flex h-full">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isAiSidebarOpen ? 'pr-96' : ''} overflow-y-auto`}>
        {/* Top Navigation Tabs */}
        <div className="bg-card border-b">
          <div className="container px-6">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="overview" className="flex-1">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-transparent border-b-0 h-auto p-0 space-x-1">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="design-studio" 
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

                  {/* Toggle AI Assistant Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                    className="ml-4"
                  >
                    {isAiSidebarOpen ? (
                      <>
                        <PanelRightClose className="h-4 w-4 mr-2" />
                        Hide AI
                      </>
                    ) : (
                      <>
                        <PanelRightOpen className="h-4 w-4 mr-2" />
                        Co-Pilot
                      </>
                    )}
                  </Button>
                </div>

                {/* Overview Tab Content */}
                <TabsContent value="overview" className="mt-0">
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
                  {/* Left Column - Project Overview & Signals */}
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      {/* Project Details Section */}
                      <div>
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-primary mb-3">
                          <FileText className="h-4 w-4" />
                          Project Details
                        </h3>
                        <div className="space-y-3 text-sm">
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
                        </div>
                      </div>

                      {/* Signals Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-warning mb-3">
                          <AlertTriangle className="h-4 w-4" />
                          Signals
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cost risk 1 (steel): schedule slack 3d. I can run a what-if now.
                        </p>
                      </div>

                      {/* Project Phase Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-primary mb-3">
                          <Target className="h-4 w-4" />
                          Project Phase
                        </h3>
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
                      </div>

                      {/* Upcoming Milestones Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-primary mb-3">
                          <Calendar className="h-4 w-4" />
                          Upcoming Milestones
                        </h3>
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Center Column - Performance Metrics */}
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      {/* Key KPIs Section */}
                      <div>
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-primary mb-3">
                          <BarChart3 className="h-4 w-4" />
                          Key KPIs
                        </h3>
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
                      </div>

                      {/* Previous Milestone Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold flex items-center gap-2 text-construction-success mb-3">
                          <CheckCircle2 className="h-4 w-4" />
                          Previous Completed Milestone
                        </h3>
                        <p className="text-sm">Schematic approved</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column - Project Information */}
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      {/* Recent Activity Section - Less Prominent */}
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/20">
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Recent Activity</h3>
                        <ul className="space-y-2 text-xs text-muted-foreground/70">
                          <li>Alice replied to RH-102 (2h ago)</li>
                          <li>Bob uploaded Design v12 (4h ago)</li>
                          <li>Chen drafted PO: Steel (1d ago)</li>
                        </ul>
                      </div>

                      {/* Project Charter Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold mb-3">Project Charter & Vision</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Access the project's guiding principles, scope, and long-term vision.
                        </p>
                        <Button className="w-full bg-construction-primary/30 hover:bg-construction-primary/40 text-construction-primary border border-construction-primary/20">Open Charter</Button>
                      </div>

                      {/* Required Information Section */}
                      <div className="pt-4 border-t">
                        <h3 className="text-base font-semibold mb-3">Required Information & Working version of files</h3>
                        <div className="space-y-2 text-sm">
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
                        </div>
                      </div>

                      {/* File Upload Section */}
                      <div className="pt-4 border-t">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Drag & drop files here or click to upload
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        SPI/CPI
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        Risks
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        Status Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Design Studio Tab */}
            <TabsContent value="design-studio" className="mt-0 h-full">
              <DesignStudio />
            </TabsContent>

            {/* 5D Tab */}
            <TabsContent value="5d" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">5D</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Automation Hub Tab */}
            <TabsContent value="automation" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Automation Hub</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Procurement Tab */}
            <TabsContent value="procurement" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Procurement</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Data Engine Tab */}
            <TabsContent value="data" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Data Engine</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>

    {/* AI Assistant Right Sidebar */}
    <div 
      className={`fixed right-0 top-0 w-96 bg-background border-l shadow-lg transition-transform duration-300 flex flex-col ${
        isAiSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ height: '100vh', maxWidth: '384px', zIndex: 40 }}
    >
      {/* Header */}
      <div className="p-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAiSidebarOpen(false)}
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="flex-1">
            <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
              <p className="text-sm">Hello! I'm your AI project assistant. I can help you with:</p>
              <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                <li>• Analyzing KPIs and performance metrics</li>
                <li>• Reviewing project risks and schedules</li>
                <li>• Generating reports and summaries</li>
                <li>• Answering questions about your project</li>
              </ul>
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">Just now</span>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground px-2">Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
            >
              What's my current SPI/CPI?
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
            >
              Show budget summary
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
            >
              List critical risks
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
            >
              Schedule status
            </Button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2 items-end">
          <Textarea 
            placeholder="Ask me anything about your project..."
            className="min-h-[44px] max-h-[120px] resize-none rounded-xl"
            rows={1}
          />
          <Button 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-construction-primary hover:bg-construction-primary/90 shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  </div>
</div>
  );
}
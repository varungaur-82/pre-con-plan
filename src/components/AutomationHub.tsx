import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Download, Bell, Settings, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CostTracker } from "./CostTracker";
import { useState } from "react";

const scheduleData = [
  { date: 'Feb 15', baseline: 20, actual: 20 },
  { date: 'Mar 15', baseline: 35, actual: 32 },
  { date: 'Apr 25', baseline: 52, actual: 48 },
  { date: 'May 25', baseline: 67, actual: 62 },
  { date: 'Jun 25', baseline: 82, actual: 76 },
  { date: 'Jul 25', baseline: 95, actual: 88 },
  { date: 'Aug 25', baseline: 100, actual: 92 },
];

const costData = [
  { date: '-32.0M', approved: 5, committed: 4, invoiced: 3, forecast: 4, contingency: 1 },
  { date: '-16.0M', approved: 12, committed: 10, invoiced: 8, forecast: 11, contingency: 1.5 },
  { date: '0', approved: 24, committed: 20, invoiced: 15, forecast: 22, contingency: 2 },
  { date: '16.0M', approved: 35, committed: 32, invoiced: 25, forecast: 34, contingency: 2.2 },
  { date: '32.0M', approved: 46, committed: 42, invoiced: 35, forecast: 43, contingency: 2.3 },
];

const metricsData = [
  { id: 1, label: "New Commitments", value: "$2.5M", change: "+4", trend: "up", color: "blue" },
  { id: 2, label: "Approved Change Orders", value: "$1.3M", change: "+3", trend: "up", color: "green" },
  { id: 3, label: "Invoices Processed", value: "$3.8M", change: "+12", trend: "up", color: "purple" },
  { id: 4, label: "Budget Transfers", value: "$500k", change: "-2", trend: "down", color: "orange" },
  { id: 5, label: "Schedule Movement", value: "-5d", change: "-1", trend: "down", color: "red" },
  { id: 6, label: "Milestones Updated", value: "+1", change: "+1", trend: "up", color: "indigo" },
];

const upcomingMilestones = [
  { name: "Foundation Complete", date: "2024-01-10", variance: "" },
  { name: "Steel Frame Start", date: "2024-01-25", variance: "-2d" },
  { name: "Steel Frame Complete", date: "2024-03-15", variance: "+3d" },
];

const riskMatrix = [
  { impact: "HI", lp: { count: 1, active: true }, mp: { count: 0, active: false }, hp: { count: 1, active: true } },
  { impact: "MI", lp: { count: 0, active: false }, mp: { count: 1, active: true }, hp: { count: 0, active: false } },
  { impact: "LI", lp: { count: 0, active: false }, mp: { count: 0, active: false }, hp: { count: 0, active: false } },
];

const topRisks = [
  {
    title: "Steel escalation +12%",
    owner: "J. Smith",
    due: "2024-01-20",
    impact: "High",
    probability: "High",
    cost: "$2.5M",
  },
  {
    title: "Permit delay risk",
    owner: "M. Johnson",
    due: "2024-02-01",
    impact: "Medium",
    probability: "Medium",
    duration: "14d",
  },
  {
    title: "Labor shortage",
    owner: "R. Davis",
    due: "2024-03-15",
    impact: "Low",
    probability: "High",
    cost: "$500k",
    duration: "7d",
  },
];

export function AutomationHub() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [createReportOpen, setCreateReportOpen] = useState(false);

  const templates = [
    {
      title: "Executive Status Dashboard",
      badge: "SD",
      description: "One-page truth for leadership – cost, schedule, risks, benchmarks,...",
      frequency: "Monthly (weekly in crunch)",
      stakeholder: "PMC Controls",
      metrics: ["CPI/SPI", "Milestone variance (days)", "+6 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"]
    },
    {
      title: "Schedule Management Plan",
      badge: "SD",
      description: "Set scheduling standards and acceptance; underpin time-risk...",
      frequency: "Baseline once; monthly updates",
      stakeholder: "Scheduler / PMC",
      metrics: ["Baseline acceptance (Y/N)", "Logic quality (% DCMA checks passed)", "+2 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"]
    },
    {
      title: "OAC Meeting Minutes + Action Tracker",
      badge: "Initiation",
      description: "Institutional memory and accountability: decisions, owners,...",
      frequency: "Weekly–Bi-weekly",
      stakeholder: "PMC Coordinator",
      metrics: ["Action closure rate (%/wk)", "Overdue actions (#)", "+2 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"]
    },
    {
      title: "Cost Performance Report",
      badge: "Financial",
      description: "Comprehensive cost analysis with variance tracking and forecasting...",
      frequency: "Monthly",
      stakeholder: "Cost Controller",
      metrics: ["Budget variance (%)", "Cost efficiency index", "+4 more"],
      previewColors: ["bg-purple-400", "bg-cyan-400", "bg-amber-400"]
    },
    {
      title: "Risk Assessment Matrix",
      badge: "Risk",
      description: "Identify, assess and track project risks with mitigation plans...",
      frequency: "Bi-weekly",
      stakeholder: "Risk Manager",
      metrics: ["Active risks (#)", "High-priority items", "+3 more"],
      previewColors: ["bg-red-400", "bg-yellow-400", "bg-blue-400"]
    },
    {
      title: "Quality Control Report",
      badge: "QA/QC",
      description: "Track inspections, defects, and corrective actions for quality assurance...",
      frequency: "Weekly",
      stakeholder: "QA Manager",
      metrics: ["Inspection pass rate (%)", "Open defects (#)", "+5 more"],
      previewColors: ["bg-indigo-400", "bg-pink-400", "bg-green-400"]
    }
  ];

  const getCellColor = (impact: string, prob: string) => {
    if (impact === "HI" && prob === "hp") return "bg-red-100 hover:bg-red-200";
    if (impact === "HI" && prob === "lp") return "bg-green-100 hover:bg-green-200";
    if (impact === "MI" && prob === "mp") return "bg-amber-100 hover:bg-amber-200";
    return "bg-gray-50 hover:bg-gray-100";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "High") return "bg-red-100 text-red-700 border-red-200";
    if (impact === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-green-100 text-green-700 border-green-200";
  };
  return (
    <Tabs defaultValue="report-automation" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="report-automation">Report Automation</TabsTrigger>
        <TabsTrigger value="cost-tracker">Cost Tracker</TabsTrigger>
      </TabsList>

      <TabsContent value="report-automation">
        <div className="container px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Report Automation</h1>
            <p className="text-muted-foreground">AI-powered report generation</p>
          </div>

          {/* Create Report Dialog */}
          <Dialog open={createReportOpen} onOpenChange={setCreateReportOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center mb-2">
                  Choose Your Template
                </DialogTitle>
                <p className="text-center text-muted-foreground">
                  Select from our enterprise-grade slides templates
                </p>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {templates.map((template, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-lg transition-all cursor-pointer hover:border-primary overflow-hidden"
                    onClick={() => {
                      setCreateReportOpen(false);
                      // Handle template selection
                    }}
                  >
                    {/* Preview Area */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-3 bg-blue-300 rounded-full w-3/4"></div>
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {template.previewColors.map((color, i) => (
                          <div key={i} className={`h-16 ${color} rounded flex-1`}></div>
                        ))}
                      </div>
                    </div>

                    {/* Content Area */}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg leading-tight flex-1">
                          {template.title}
                        </h3>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {template.badge}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{template.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{template.stakeholder}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {template.metrics.slice(0, 2).map((metric, i) => (
                          <div key={i} className="text-sm text-primary">
                            {metric}
                          </div>
                        ))}
                        {template.metrics.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            {template.metrics[2]}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* My Reports Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">My Reports</h2>
              <Button onClick={() => setCreateReportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Q1 2025 Cost Performance Report",
                  date: "Jan 15, 2025",
                  type: "Cost Analysis",
                  status: "Completed",
                  kpis: ["Budget Variance", "Cost Efficiency", "ROI"]
                },
                {
                  title: "Foundation Phase Schedule Analysis",
                  date: "Jan 10, 2025",
                  type: "Schedule Report",
                  status: "In Progress",
                  kpis: ["Schedule Variance", "Critical Path", "Milestones"]
                },
                {
                  title: "Steel Frame Risk Assessment",
                  date: "Jan 8, 2025",
                  type: "Risk Report",
                  status: "Completed",
                  kpis: ["Risk Matrix", "Mitigation Status", "Impact Analysis"]
                },
                {
                  title: "Contractor Performance Review",
                  date: "Jan 5, 2025",
                  type: "Performance Report",
                  status: "Completed",
                  kpis: ["Quality Score", "Timeline Adherence", "Cost Control"]
                },
                {
                  title: "Monthly Safety Compliance Report",
                  date: "Dec 28, 2024",
                  type: "Safety Report",
                  status: "Completed",
                  kpis: ["Incident Rate", "Compliance Score", "Training Hours"]
                },
                {
                  title: "Change Order Impact Analysis",
                  date: "Dec 20, 2024",
                  type: "Change Management",
                  status: "Completed",
                  kpis: ["Change Orders", "Cost Impact", "Schedule Impact"]
                }
              ].map((report, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {report.type}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        {report.date}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {report.kpis.map((kpi, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Templates Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Templates</h2>
              <Button variant="outline">View All Templates</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Monthly Executive Summary",
                  description: "High-level project overview for stakeholders",
                  category: "Executive",
                  frequency: "Monthly"
                },
                {
                  name: "Cost Performance Index",
                  description: "Detailed cost variance and efficiency analysis",
                  category: "Financial",
                  frequency: "Weekly"
                },
                {
                  name: "Schedule Variance Report",
                  description: "Track timeline deviations and critical path",
                  category: "Schedule",
                  frequency: "Weekly"
                },
                {
                  name: "Risk Register Update",
                  description: "Active risks, mitigation plans, and status",
                  category: "Risk",
                  frequency: "Bi-weekly"
                },
                {
                  name: "Quality Control Report",
                  description: "Inspections, defects, and corrective actions",
                  category: "Quality",
                  frequency: "Weekly"
                },
                {
                  name: "Subcontractor Performance",
                  description: "Evaluate contractor quality and timeline",
                  category: "Performance",
                  frequency: "Monthly"
                },
                {
                  name: "Safety Incident Report",
                  description: "Safety metrics, incidents, and training",
                  category: "Safety",
                  frequency: "Weekly"
                },
                {
                  name: "Change Order Summary",
                  description: "Track change requests and approvals",
                  category: "Change Mgmt",
                  frequency: "As needed"
                }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-xs text-muted-foreground">{template.frequency}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    {
                      action: "Opened",
                      report: "Q1 2025 Cost Performance Report",
                      time: "2 hours ago",
                      user: "You"
                    },
                    {
                      action: "Generated",
                      report: "Foundation Phase Schedule Analysis",
                      time: "5 hours ago",
                      user: "You"
                    },
                    {
                      action: "Shared",
                      report: "Steel Frame Risk Assessment",
                      time: "1 day ago",
                      user: "You"
                    },
                    {
                      action: "Edited",
                      report: "Monthly Executive Summary",
                      time: "2 days ago",
                      user: "You"
                    },
                    {
                      action: "Opened",
                      report: "Contractor Performance Review",
                      time: "3 days ago",
                      user: "You"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.report}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action} by {activity.user}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Training</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Introduction to Report Automation",
                      "Understanding KPIs",
                      "AI Assistant Basics"
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Advanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Scenario Simulation",
                      "Custom Templates",
                      "Data Integration"
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Report Quality Guidelines",
                      "Team Collaboration",
                      "Common Pitfalls"
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cost-tracker">
        <CostTracker />
      </TabsContent>
    </Tabs>
  );
}

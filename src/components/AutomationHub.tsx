import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Download, Bell, Settings as SettingsIcon, Calendar, User, ExternalLink, FileText, Users2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostTracker } from "./CostTracker";
import { ScheduleTracker } from "./ScheduleTracker";
import { CreateReportWizard } from "./CreateReportWizard";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const templates = [
    {
      title: "Executive Status Dashboard",
      badge: "SD",
      description: "One-page truth for leadership – cost, schedule, risks, benchmarks,...",
      frequency: "Monthly (weekly in crunch)",
      stakeholder: "PMC Controls",
      metrics: ["CPI/SPI", "Milestone variance (days)", "+6 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"],
      suggestedKPIs: ["Budget Variance", "Schedule Performance", "Risk Score", "Milestone Achievement"],
      suggestedDataSources: ["financials", "schedules", "reports"]
    },
    {
      title: "Schedule Management Plan",
      badge: "SD",
      description: "Set scheduling standards and acceptance; underpin time-risk...",
      frequency: "Baseline once; monthly updates",
      stakeholder: "Scheduler / PMC",
      metrics: ["Baseline acceptance (Y/N)", "Logic quality (% DCMA checks passed)", "+2 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"],
      suggestedKPIs: ["Schedule Performance", "Critical Path Variance", "Milestone Achievement"],
      suggestedDataSources: ["schedules", "reports", "drawings"]
    },
    {
      title: "OAC Meeting Minutes + Action Tracker",
      badge: "Initiation",
      description: "Institutional memory and accountability: decisions, owners,...",
      frequency: "Weekly–Bi-weekly",
      stakeholder: "PMC Coordinator",
      metrics: ["Action closure rate (%/wk)", "Overdue actions (#)", "+2 more"],
      previewColors: ["bg-blue-400", "bg-green-400", "bg-orange-400"],
      suggestedKPIs: ["Milestone Achievement", "Compliance Rate"],
      suggestedDataSources: ["correspondence", "reports", "admin"]
    },
    {
      title: "Cost Performance Report",
      badge: "Financial",
      description: "Comprehensive cost analysis with variance tracking and forecasting...",
      frequency: "Monthly",
      stakeholder: "Cost Controller",
      metrics: ["Budget variance (%)", "Cost efficiency index", "+4 more"],
      previewColors: ["bg-purple-400", "bg-cyan-400", "bg-amber-400"],
      suggestedKPIs: ["Budget Variance", "Cost Efficiency Index", "Change Order Impact", "Resource Utilization"],
      suggestedDataSources: ["financials", "procurement", "contracts"]
    },
    {
      title: "Risk Assessment Matrix",
      badge: "Risk",
      description: "Identify, assess and track project risks with mitigation plans...",
      frequency: "Bi-weekly",
      stakeholder: "Risk Manager",
      metrics: ["Active risks (#)", "High-priority items", "+3 more"],
      previewColors: ["bg-red-400", "bg-yellow-400", "bg-blue-400"],
      suggestedKPIs: ["Risk Score", "Compliance Rate", "Safety Incidents"],
      suggestedDataSources: ["reports", "correspondence", "admin"]
    },
    {
      title: "Quality Control Report",
      badge: "QA/QC",
      description: "Track inspections, defects, and corrective actions for quality assurance...",
      frequency: "Weekly",
      stakeholder: "QA Manager",
      metrics: ["Inspection pass rate (%)", "Open defects (#)", "+5 more"],
      previewColors: ["bg-indigo-400", "bg-pink-400", "bg-green-400"],
      suggestedKPIs: ["Quality Metrics", "Compliance Rate", "Safety Incidents", "Vendor Performance"],
      suggestedDataSources: ["reports", "drawings", "correspondence"]
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
        <TabsTrigger value="schedule-tracker">Schedule Tracker</TabsTrigger>
      </TabsList>

      <TabsContent value="report-automation">
        <div className="w-full">
          {/* Hero Section with subtle gradient */}
          <div className="bg-gradient-to-br from-blue-50/30 via-background to-purple-50/30 py-12 px-6 mb-0">
            <div className="container max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-3">Report Automation</h1>
                  <p className="text-lg text-muted-foreground">AI-powered insights and analytics at your fingertips</p>
                </div>
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" variant="outline" className="shadow-lg">
                        <SettingsIcon className="mr-2 h-5 w-5" />
                        Quick Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuItem 
                        onClick={() => {
                          toast({
                            title: "Generate Report",
                            description: "Report generation feature coming soon!",
                          });
                        }}
                        className="py-3 cursor-pointer"
                      >
                        <BarChart3 className="mr-3 h-5 w-5 text-green-600" />
                        <span className="text-base font-medium">Generate Report</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          toast({
                            title: "Export Data",
                            description: "Data export feature coming soon!",
                          });
                        }}
                        className="py-3 cursor-pointer"
                      >
                        <FileText className="mr-3 h-5 w-5 text-red-600" />
                        <span className="text-base font-medium">Export Data</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          toast({
                            title: "Set Alerts",
                            description: "Alert configuration feature coming soon!",
                          });
                        }}
                        className="py-3 cursor-pointer"
                      >
                        <AlertCircle className="mr-3 h-5 w-5 text-orange-600" />
                        <span className="text-base font-medium">Set Alerts</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          toast({
                            title: "Configure Settings",
                            description: "Settings configuration feature coming soon!",
                          });
                        }}
                        className="py-3 cursor-pointer"
                      >
                        <Users2 className="mr-3 h-5 w-5 text-gray-600" />
                        <span className="text-base font-medium">Configure Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="lg" onClick={() => setCreateReportOpen(true)} className="shadow-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Create New Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Create Report Wizard */}
          <CreateReportWizard
            open={createReportOpen}
            onOpenChange={setCreateReportOpen}
            templates={templates}
          />

          {/* My Reports Section - Clean white background */}
          <div className="bg-background py-12 px-6">
            <div className="container max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">My Reports</h2>
                  <p className="text-muted-foreground">Access and manage your generated reports</p>
                </div>
                <Button variant="outline" size="lg">
                  View All Reports
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Card key={index} className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-semibold leading-snug">{report.title}</CardTitle>
                        <Badge variant={report.status === "Completed" ? "default" : "secondary"} className="ml-2 shrink-0">
                          {report.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {report.type}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {report.date}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {report.kpis.map((kpi, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Section - Subtle teal background */}
          <div className="bg-gradient-to-br from-teal-50/20 via-background to-cyan-50/20 py-12 px-6 mt-6">
            <div className="container max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Recent Activity</h2>
                <p className="text-muted-foreground">Track your recent interactions and changes</p>
              </div>
              
              <Card className="shadow-lg">
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
                      <div key={index} className="flex items-center justify-between p-5 hover:bg-accent/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-base">{activity.report}</p>
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
          </div>

          {/* Training Section - Subtle purple background */}
          <div className="bg-gradient-to-br from-purple-50/20 via-background to-indigo-50/20 py-12 px-6 mt-6">
            <div className="container max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Training & Resources</h2>
                <p className="text-muted-foreground">Learn how to maximize your report automation capabilities</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Getting Started */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <SettingsIcon className="h-5 w-5 text-primary" />
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
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                        >
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Features */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <TrendingUp className="h-5 w-5 text-primary" />
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
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                        >
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Best Practices */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Bell className="h-5 w-5 text-primary" />
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
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                        >
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cost-tracker">
        <CostTracker />
      </TabsContent>

      <TabsContent value="schedule-tracker">
        <ScheduleTracker />
      </TabsContent>
    </Tabs>
  );
}

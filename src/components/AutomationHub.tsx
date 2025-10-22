import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Download, Bell, Settings, Save, Users, Clock, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostTracker } from "./CostTracker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const navigationItems = [
  { id: "templates", label: "Templates", icon: BarChart3, count: 3, path: "/report-automation/templates" },
  { id: "my-reports", label: "My Reports", icon: Save, count: 2, path: "/report-automation/my-reports" },
  { id: "shared-templates", label: "Shared Templates", icon: Users, path: "/report-automation/shared-templates" },
  { id: "recent-activity", label: "Recent Activity", icon: Clock, count: 3, path: "/report-automation/recent-activity" },
  { id: "training", label: "Training", icon: GraduationCap, path: "/report-automation/training" },
];

export function AutomationHub() {
  const navigate = useNavigate();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

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

          <div className="space-y-3 max-w-md">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <Badge variant="secondary" className="bg-secondary/50">
                      {item.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cost-tracker">
        <CostTracker />
      </TabsContent>
    </Tabs>
  );
}

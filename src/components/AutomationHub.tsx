import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, BarChart3, Download, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="cost-tracker">Cost Tracker</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="container px-6 py-8">
          {/* Welcome Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
            SC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, Sarah Chen
            </h1>
            <p className="text-sm text-muted-foreground">
              Project Manager (PM)
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-15">
          Your project dashboard is updated with the latest cost data and schedule insights.
        </p>
      </div>

      {/* Project Details & Executive Summary Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-right">Downtown Office Complex</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium">PRJ-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">Commercial Office</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">125,000 sq ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">$50.0M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-medium">2024-12-15</span>
              </div>
            </div>

            {/* Project Status */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-4">Project Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Overall Health</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    On Track
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget Status</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Within Budget
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Schedule Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    On Time
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Executive Summary</CardTitle>
              <span className="text-xs text-muted-foreground">
                Last updated 2024-01-15
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Cost & Schedule:</span>
                </div>
                <p className="text-xs text-foreground">
                  Under budget by $2.1M; Running 5 days behind schedule
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Current Phase:</span>
                </div>
                <p className="text-xs text-foreground">Foundation & Structure</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Scope Changes:</span>
                </div>
                <p className="text-xs text-foreground">
                  8 approved ($4.2M), 3 pending ($1.5M)
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Cashflow:</span>
                </div>
                <p className="text-xs text-foreground">
                  This period $3.8M Actual / $4.2M Planned; This period 90% of Planned
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Last Completed:</span>
                </div>
                <p className="text-xs text-foreground">Foundation Complete (2024-01-10)</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Next Milestone:</span>
                </div>
                <p className="text-xs text-foreground">Steel Frame Start (2024-01-25)</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Decision Needed:</span>
                </div>
                <p className="text-xs text-red-600">
                  Approve steel escalation contingency (due 2024-01-20, J. Smith)
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Signals:</span>
                </div>
                <p className="text-xs text-foreground">
                  SPI: 0.95 (↓), CPI: 1.02 (↑), Market: Steel +12% (↑)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What Changed This Period */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">What Changed This Period?</h2>
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {metricsData.map((metric) => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-${metric.color}-500 text-lg font-bold flex items-center gap-1`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Schedule Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Schedule Overview</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">B0</Badge>
                <Badge variant="outline" className="text-xs">B1</Badge>
                <Badge variant="outline" className="text-xs">B2</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-4">
              <p className="text-xs text-red-700">Running 5 days behind schedule</p>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: '100%', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend iconType="line" wrapperStyle={{ fontSize: '11px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Baseline"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Actual %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Upcoming Milestones */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-semibold mb-3">Upcoming Milestones</h3>
              <div className="space-y-2">
                {upcomingMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-foreground">{milestone.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{milestone.date}</span>
                      {milestone.variance && (
                        <span className={milestone.variance.startsWith('-') ? 'text-green-600' : 'text-red-600'}>
                          {milestone.variance}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cost Overview</CardTitle>
              <select className="text-xs border rounded px-2 py-1">
                <option>S-Curve</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Budget Summary */}
            <div className="grid grid-cols-5 gap-3 mb-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-sm font-bold">$45.8M</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Commitments</p>
                <p className="text-sm font-bold">$41.9M</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Invoiced</p>
                <p className="text-sm font-bold">$23.0M</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Forecast</p>
                <p className="text-sm font-bold">$42.6M</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contingency</p>
                <p className="text-sm font-bold">$2.3M</p>
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-xs">
              <div>
                <span className="text-muted-foreground">Commit/Budget:</span>
                <span className="ml-2 text-red-600 font-medium">91%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Forecast/Budget:</span>
                <span className="ml-2 text-green-600 font-medium">93%</span>
              </div>
              <span className="text-green-600 font-medium">Under budget by $3.2M</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '10px' }}
                    payload={[
                      { value: 'Approved Budget', type: 'circle', color: '#3b82f6' },
                      { value: 'Committed', type: 'circle', color: '#10b981' },
                      { value: 'Invoiced', type: 'circle', color: '#06b6d4' },
                      { value: 'Planned Cashflow', type: 'circle', color: '#8b5cf6' },
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    strokeDasharray="3 3"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="committed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invoiced" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="contingency" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risks & Quick Actions Section */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Risks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risks</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Risk Heat Map */}
            <div className="grid grid-cols-[auto_1fr] gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-4">Risk Heat Map</h3>
                <div className="inline-block">
                  {/* Heat Map Table */}
                  <div className="grid grid-cols-[60px_repeat(3,140px)] gap-2">
                    {/* Header */}
                    <div></div>
                    <div className="text-center text-xs font-medium text-muted-foreground">LP</div>
                    <div className="text-center text-xs font-medium text-muted-foreground">MP</div>
                    <div className="text-center text-xs font-medium text-muted-foreground">HP</div>

                    {/* Rows */}
                    {riskMatrix.map((row) => (
                      <>
                        <div className="flex items-center text-xs font-medium text-muted-foreground">
                          {row.impact}
                        </div>
                        {["lp", "mp", "hp"].map((prob) => {
                          const cell = row[prob as keyof typeof row] as { count: number; active: boolean };
                          return (
                            <button
                              key={`${row.impact}-${prob}`}
                              onClick={() => setSelectedCell(`${row.impact}-${prob}`)}
                              className={`relative h-14 rounded-md border transition-colors ${getCellColor(row.impact, prob)}`}
                            >
                              <span className="text-lg font-semibold">{cell.count}</span>
                              {cell.active && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              )}
                            </button>
                          );
                        })}
                      </>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      HI=High Impact, MI=Medium Impact, LI=Low Impact  LP=Low Probability, MP=Medium Probability, HP=High Probability
                    </p>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded"></div>
                        <span className="text-muted-foreground">Green (Low)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-100 rounded"></div>
                        <span className="text-muted-foreground">Amber (Medium)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Active Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Summary */}
              <div className="border rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-sm font-semibold mb-2">Risk Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCell ? `Selected: ${selectedCell}` : "Select a cell to see details here."}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Risks */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold mb-4">Top Risks</h3>
              <div className="space-y-3">
                {topRisks.map((risk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{risk.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {risk.owner} • Due {risk.due}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getImpactColor(risk.impact)}>
                        {risk.impact}
                      </Badge>
                      <Badge variant="outline" className={getImpactColor(risk.probability)}>
                        {risk.probability}
                      </Badge>
                      {risk.cost && <span className="text-sm font-medium">{risk.cost}</span>}
                      {risk.duration && <span className="text-sm font-medium">{risk.duration}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <Download className="h-5 w-5 text-red-500" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <Bell className="h-5 w-5 text-amber-500" />
              <span>Set Alerts</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
              <Settings className="h-5 w-5 text-gray-500" />
              <span>Configure Settings</span>
            </Button>
          </CardContent>
        </Card>
      </div>
        </div>
      </TabsContent>

      <TabsContent value="cost-tracker">
        <CostTracker />
      </TabsContent>
    </Tabs>
  );
}

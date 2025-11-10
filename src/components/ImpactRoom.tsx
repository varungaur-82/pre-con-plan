import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, TrendingUp, ChevronRight, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const forecastTrendData = [
  { month: 'Jan 16', forecast: 10, target: 8 },
  { month: 'Feb 16', forecast: 20, target: 18 },
  { month: 'Mar 16', forecast: 35, target: 30 },
  { month: 'Apr 16', forecast: 50, target: 42 },
  { month: 'May 1', forecast: 65, target: 55 },
];

const criticalPathNodes = [
  { name: "Permit Approval", delay: "+3d" },
  { name: "Foundation Complete", delay: "+8d" },
  { name: "Structure Complete", delay: "+10d" },
  { name: "MEP Rough-In", delay: "+9d" },
  { name: "Substantial Completion", delay: "+8d" },
];

const baselineOverlays = [
  { task: "Procurement Start", baseline: 10, actual: 25, delay: "+18d" },
  { task: "Design Complete", baseline: 30, actual: 30, delay: "+10d" },
  { task: "Permit Approval", baseline: 40, actual: 50, delay: "+10d" },
  { task: "Structure Complete", baseline: 60, actual: 75, delay: "+10d" },
  { task: "Foundation Comp...", baseline: 55, actual: 65, delay: "+8d" },
];

const aiSuggestions = [
  {
    category: "Overlap",
    title: "Start Procurement SS with late Design",
    description: "Begin procurement activities 7 days before design completion using start-to-start dependency.",
    impact: "Est. recover: 7d · Required: 2 milestones",
    warning: "⚠️ Slight: Requires coordination with design team",
    stage: "ONLY 20d"
  },
  {
    category: "Overlap",
    title: "Early Long-Lead Procurement",
    description: "Begin long-lead item procurement 14 days earlier using pre-award purchase orders.",
    impact: "Est. recover: 14d · Required: 2 milestones",
    warning: "⚠️ Slight: Upfront charges may require rework",
    stage: "ONLY 20d"
  },
  {
    category: "Resequence",
    title: "Swap FS to SS for MEP Rough-In",
    description: "Change finish-to-start to start-to-start dependency with 5-day lag to overlap activities.",
    impact: "Est. recover: 8d · Impacted: 3 milestones",
    warning: "⚠️ Slight: May require additional crew",
    stage: "PRO ONLY"
  },
  {
    category: "Escalate",
    title: "Request Expedited Permit Review",
    description: "Request expedited permit processing through city planning department.",
    impact: "Est. recover: 10d · Required: 1 milestone",
    warning: "⚠️ Slight: Additional cost; may require owner approval",
    stage: "PRO ONLY"
  },
];

export function ImpactRoom() {
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Impact Room</h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              See how far off target you are, why, and what to do next—with safe, staged what-ifs that don't auto-commit
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>Project Alpha</span>
              <span>Reference Baseline v1.0</span>
              <span>Period: Oct 28 - Nov 4</span>
            </div>
          </div>
          <Button>Stage All Suggested Fixes</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Forecast vs Target</div>
              <div className="text-3xl font-bold text-destructive">→ +46d</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Critical Path Length</div>
              <div className="text-3xl font-bold">5 nodes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Items at Risk</div>
              <div className="text-3xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Potential Recovery</div>
              <div className="text-3xl font-bold">0d</div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast vs Target Trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Forecast vs Target Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecastTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Days Ahead', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Forecast"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Path */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Critical Path</CardTitle>
            <Button variant="link" className="text-sm">Explain path</Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {criticalPathNodes.map((node, idx) => (
                <div key={idx} className="flex items-center">
                  <Badge variant="destructive" className="px-3 py-1">
                    {node.name} <span className="ml-2">{node.delay}</span>
                  </Badge>
                  {idx < criticalPathNodes.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Baseline vs Actual Overlays */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Baseline vs Actual Overlays</CardTitle>
            <div className="flex items-center gap-4">
              <Select defaultValue="largest">
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="largest">Largest slip</SelectItem>
                  <SelectItem value="critical">Critical only</SelectItem>
                  <SelectItem value="all">All tasks</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked />
                Critical only
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {baselineOverlays.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-40 text-sm">{item.task}</div>
                  <div className="flex-1 relative h-8">
                    {/* Baseline bar */}
                    <div
                      className="absolute bg-red-400 h-6 rounded top-1"
                      style={{
                        left: `${item.baseline}%`,
                        width: '30%',
                      }}
                    />
                    {/* Actual bar overlay */}
                    <div
                      className="absolute bg-blue-200 h-6 rounded top-1 border-l-2 border-blue-400"
                      style={{
                        left: `${item.actual}%`,
                        width: '5%',
                      }}
                    />
                  </div>
                  <div className="w-16 text-sm text-destructive font-medium text-right">
                    {item.delay}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* What-if Sandbox */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What-if Sandbox</CardTitle>
              <p className="text-sm text-muted-foreground">
                Simulate changes without committing. Preview forecast impact and stage to Builder's Change Queue.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select milestone...</label>
                <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select milestone..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="permit">Permit Approval</SelectItem>
                    <SelectItem value="foundation">Foundation Complete</SelectItem>
                    <SelectItem value="structure">Structure Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Action...</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Action..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="accelerate">Accelerate by adding crew</SelectItem>
                    <SelectItem value="overlap">Change to SS overlap</SelectItem>
                    <SelectItem value="expedite">Request expedited review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Value</label>
                <input 
                  type="text" 
                  placeholder="e.g., 5 days"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <Button className="w-full" variant="outline">Preview Impact</Button>
            </CardContent>
          </Card>

          {/* AI Recovery Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Recovery Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {suggestion.category}
                      </Badge>
                      <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{suggestion.impact}</p>
                        <p className="text-xs text-orange-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {suggestion.warning}
                        </p>
                      </div>
                    </div>
                    <Button variant="link" size="sm" className="text-primary">
                      {suggestion.stage}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Minus, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from "recharts";
import { ScheduleBuilder } from "./ScheduleBuilder";

const sCurveData = [
  { month: '2025-08', baseline: 2, actual: 0 },
  { month: '2025-09', baseline: 5, actual: 3 },
  { month: '2025-10', baseline: 12, actual: 10 },
  { month: '2025-11', baseline: 25, actual: 23 },
  { month: '2025-12', baseline: 42, actual: 40 },
  { month: '2026-01', baseline: 57, actual: 55 },
  { month: '2026-02', baseline: 72, actual: 70 },
  { month: '2026-03', baseline: 90, actual: 88 },
];

const waterfallData = [
  { phase: 'Design', value: 5, cumulative: 5 },
  { phase: 'Permitting', value: -2, cumulative: 3 },
  { phase: 'Procurement', value: 7, cumulative: 10 },
  { phase: 'Construction', value: -7, cumulative: 3 },
  { phase: 'Commissioning', value: 0, cumulative: 3 },
];

export function ScheduleTracker() {
  const [activeView, setActiveView] = useState("snapshot");

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Schedule Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Owner-first schedule status, look-ahead, and period changes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={activeView === "snapshot" ? "default" : "outline"}
              onClick={() => setActiveView("snapshot")}
            >
              Schedule Snapshot
            </Button>
            <Button 
              variant={activeView === "builder" ? "default" : "outline"}
              onClick={() => setActiveView("builder")}
            >
              Schedule Builder
            </Button>
            <Button variant="outline">Schedule Alignment</Button>
            <Button variant="outline">Schedule Rules</Button>
            <Button variant="outline">Impact Room</Button>
          </div>
        </div>
      </div>

      {/* Conditional Content */}
      {activeView === "builder" ? (
        <ScheduleBuilder />
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-5 gap-4">
        {/* Health Score */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Health Score</div>
              <div className="text-5xl font-bold text-amber-600 mb-1">72</div>
              <div className="text-xs text-muted-foreground">RAG: amber</div>
            </div>
          </CardContent>
        </Card>

        {/* Target vs Forecast */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Target vs Forecast</div>
              <div className="text-5xl font-bold mb-1">8d</div>
              <div className="text-xs text-muted-foreground">Forecast: Dec 3</div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Path */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Critical Path</div>
              <div className="text-5xl font-bold mb-1">12</div>
              <div className="text-xs text-muted-foreground">MEP Rough-In delay</div>
            </div>
          </CardContent>
        </Card>

        {/* Period Changes */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Period Changes</div>
              <div className="text-5xl font-bold mb-1">3</div>
              <div className="text-xs text-muted-foreground">2 risks, 1 overdue</div>
            </div>
          </CardContent>
        </Card>

        {/* Trend */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Trend</div>
              <div className="h-16 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { x: 1, y: 70 },
                    { x: 2, y: 68 },
                    { x: 3, y: 71 },
                    { x: 4, y: 72 },
                  ]}>
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between py-4 border-y">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Date Range:</span>
          <select className="px-3 py-1.5 border rounded-md text-sm">
            <option>Jan</option>
            <option>Feb</option>
            <option>Mar</option>
          </select>
          <span className="text-sm text-muted-foreground">to</span>
          <select className="px-3 py-1.5 border rounded-md text-sm">
            <option>Dec</option>
            <option>Nov</option>
            <option>Oct</option>
          </select>
          <span className="text-sm text-muted-foreground">(Jan - Dec)</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Panes:</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">2</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm font-medium">Layout:</span>
          <Button variant="link" className="text-primary">Optimize Width</Button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Schedule S-Curve */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Schedule S-Curve
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox id="baseline" defaultChecked />
                <label htmlFor="baseline" className="text-sm flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Baseline
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="actual" defaultChecked />
                <label htmlFor="actual" className="text-sm flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Actual %
                </label>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  label={{ value: '90%', angle: 0, position: 'insideLeft' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 90]}
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
                  dataKey="baseline" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Slip Waterfall */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Slip Waterfall
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="phase" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  domain={[-3, 9]}
                  ticks={[-3, 0, 3, 6, 9]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 0 ? '#ef4444' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
}

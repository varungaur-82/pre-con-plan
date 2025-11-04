import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown,
  MapPin,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function FiveDSchedule() {
  const [activeModule, setActiveModule] = useState<"overview" | "workspace" | "basis">("overview");
  const [isSchedulePostureOpen, setIsSchedulePostureOpen] = useState(true);
  const [isChangeDriversOpen, setIsChangeDriversOpen] = useState(false);
  const [isPathHealthOpen, setIsPathHealthOpen] = useState(false);
  const [isLongLeadOpen, setIsLongLeadOpen] = useState(false);
  const [isLookAheadOpen, setIsLookAheadOpen] = useState(false);
  const [lookAheadPeriod, setLookAheadPeriod] = useState<"7days" | "2weeks" | "1month" | "quarter">("2weeks");

  const changeDriversData = [
    { name: 'Procurement / Long-Lead', value: 22, days: '22d', percentage: '27.5%', color: '#3b82f6' },
    { name: 'Decision Latency', value: 18, days: '18d', percentage: '22.5%', color: '#10b981' },
    { name: 'Design Coordination & Rework', value: 12, days: '12d', percentage: '15.0%', color: '#f59e0b' },
    { name: 'Permits & Third Parties', value: 10, days: '10d', percentage: '12.5%', color: '#ef4444' },
    { name: 'Scope Evolution', value: 8, days: '8d', percentage: '10.0%', color: '#8b5cf6' },
    { name: 'Information Latency/Quality', value: 6, days: '6d', percentage: '7.5%', color: '#ec4899' },
    { name: 'Assumption Errors', value: 4, days: '4d', percentage: '5.0%', color: '#06b6d4' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <h1 className="text-2xl font-bold mb-4">5D Schedule Modules</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeModule === "overview" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveModule("overview")}
          >
            Executive Overview
          </Button>
          <Button 
            variant={activeModule === "workspace" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveModule("workspace")}
          >
            Schedule Workspace
          </Button>
          <Button 
            variant={activeModule === "basis" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveModule("basis")}
          >
            Basis of Schedule (BoS)
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeModule === "overview" && (
          <div className="p-6 space-y-6">
            {/* Filters Bar */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Design Option:</span>
                    <select className="px-3 py-1.5 border rounded-md text-sm bg-background">
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Scenario:</span>
                    <select className="px-3 py-1.5 border rounded-md text-sm bg-background">
                      <option>Baseline</option>
                      <option>Optimistic</option>
                      <option>Conservative</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Version:</span>
                    <select className="px-3 py-1.5 border rounded-md text-sm bg-background">
                      <option>DD-S04</option>
                      <option>DD-S03</option>
                      <option>SD-S02</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Schedule Source:</span>
                    <select className="px-3 py-1.5 border rounded-md text-sm bg-background">
                      <option>Saved Schedules</option>
                      <option>Import Schedule</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>NYC Metro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="union" />
                    <label htmlFor="union" className="text-sm">Union Shop</label>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>NYC 2025</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">62 weeks</div>
                  <div className="text-sm text-muted-foreground">Total Duration</div>
                  <div className="text-xs text-muted-foreground">Mar 1, 2024 → Apr 15, 2025</div>
                  <div className="text-3xl font-bold mt-2">2</div>
                  <div className="text-sm text-muted-foreground">Critical Paths</div>
                  <div className="text-xs text-muted-foreground">28 weeks longest</div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Total Duration Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Total Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">62 weeks</div>
                    <div className="text-sm text-muted-foreground">
                      NTP: Mar 1, 2024 → SC: Apr 15, 2025
                    </div>
                    <div className="text-sm text-amber-600">
                      +8 days vs last version
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critical Path Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Critical Path
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">2 paths</div>
                    <div className="text-sm text-muted-foreground">
                      Longest path: 28 weeks. 2 paths with ≥50% near-critical tasks.
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      View path health →
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* At Risk Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    At Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">3 long-leads</div>
                    <div className="text-sm text-muted-foreground">
                      3 high-risk decisions pending. 2 paths with constraint gaps.
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      View risks →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Posture Section */}
            <Collapsible open={isSchedulePostureOpen} onOpenChange={setIsSchedulePostureOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Schedule Posture
                      </CardTitle>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isSchedulePostureOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <p className="text-sm text-muted-foreground text-left mt-1">
                      Where are we on duration and milestones? What's locked, what's drifting?
                    </p>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Baseline Milestone Gantt (Target vs Completion)</h3>
                      
                      {/* Gantt Chart Container */}
                      <div className="bg-muted/30 rounded-lg p-6 overflow-x-auto">
                        <div className="min-w-[800px]">
                          {/* Timeline Header */}
                          <div className="flex mb-6 pl-40">
                            <div className="flex-1 flex justify-around text-xs text-muted-foreground border-b pb-2">
                              <span>Mar '24</span>
                              <span>Aug '24</span>
                              <span>Jan '25</span>
                              <span>Jul '25</span>
                              <span>Nov '25</span>
                            </div>
                          </div>

                          {/* Gantt Rows */}
                          <div className="space-y-3">
                            {/* SD Phase */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">SD Phase</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '5%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '25%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* DD Phase */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">DD Phase</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '25%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* CD Phase */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">CD Phase</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '58%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* Permit Application */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">Permit Application</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '42%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '62%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* Procurement Package */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">Procurement Package</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '75%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* Long-Lead Procurement */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">Long-Lead Procurement</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '45%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '75%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* Installation Work */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">Installation Work</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '62%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '82%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>

                            {/* Commissioning Activities */}
                            <div className="flex items-center">
                              <div className="w-40 text-sm text-muted-foreground">Commissioning Activities</div>
                              <div className="flex-1 relative h-8">
                                <div className="absolute" style={{ left: '78%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                                <div className="absolute" style={{ left: '88%', top: '50%', transform: 'translateY(-50%)' }}>
                                  <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Timeline Footer */}
                          <div className="flex mt-6 pl-40 text-xs text-muted-foreground">
                            <div className="flex-1 text-center">
                              Months from NTP
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rotate-45"></div>
                              <span>Actual</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rotate-45"></div>
                              <span>Baseline</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-0.5 h-6 border-l-2 border-dashed border-red-500"></div>
                              <span>Today</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Milestone Stability Trend Chart */}
                      <div className="space-y-4 mt-8 pt-8 border-t">
                        <h3 className="font-semibold">Milestone Stability Trend (Last 4 Versions)</h3>
                        <div className="bg-background rounded-lg p-4 border">
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart 
                              data={[
                                { version: 'SD-S02', days: 0 },
                                { version: 'DD-S01', days: 3 },
                                { version: 'DD-S03', days: -3 },
                                { version: 'DD-S04', days: 6 }
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis 
                                dataKey="version" 
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                              />
                              <YAxis 
                                label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 } }}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                domain={[-3, 9]}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value} days`, 'Drift']}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--background))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '6px'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="days" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Change Drivers Section */}
            <Collapsible open={isChangeDriversOpen} onOpenChange={setIsChangeDriversOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Change Drivers
                      </CardTitle>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isChangeDriversOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <p className="text-sm text-muted-foreground text-left mt-1">
                      Why did the end date move since last version?
                    </p>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Schedule Change Drivers</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            PNG
                          </Button>
                          <Button variant="outline" size="sm">
                            CSV
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        {/* Pie Chart */}
                        <div className="flex-shrink-0">
                          <ResponsiveContainer width={300} height={300}>
                            <PieChart>
                              <Pie
                                data={changeDriversData}
                                cx={150}
                                cy={150}
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ days }) => days}
                                labelLine={false}
                              >
                                {changeDriversData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number, name: string, props: any) => [
                                  `${props.payload.days} (${props.payload.percentage})`,
                                  props.payload.name
                                ]}
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--background))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '6px'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 space-y-2">
                          {changeDriversData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm">{item.days}</span>
                                <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                                  ({item.percentage})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Path Health Section */}
            <Collapsible open={isPathHealthOpen} onOpenChange={setIsPathHealthOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Path Health
                      </CardTitle>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isPathHealthOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      How fragile is the plan and where can it break?
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Float Exposure Histogram</h3>
                          <p className="text-sm text-muted-foreground">
                            Distribution of activities by available float (slack time). Lower float = higher schedule risk.
                          </p>
                        </div>
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      
                      {/* Bar Chart */}
                      <div className="bg-muted/30 rounded-lg p-6">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart
                            data={[
                              { range: '0-2d', activities: 15, color: '#ef4444' },
                              { range: '3-5d', activities: 30, color: '#f59e0b' },
                              { range: '6-10d', activities: 27, color: '#3b82f6' },
                              { range: '>10d', activities: 18, color: '#10b981' }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="range" 
                              label={{ value: 'Float Range', position: 'insideBottom', offset: -10 }}
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis 
                              label={{ value: '% of Activities', angle: -90, position: 'insideLeft' }}
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--background))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                              formatter={(value: number) => [`${value}%`, 'Activities']}
                            />
                            <Bar dataKey="activities" radius={[4, 4, 0, 0]}>
                              {[
                                { range: '0-2d', activities: 15, color: '#ef4444' },
                                { range: '3-5d', activities: 30, color: '#f59e0b' },
                                { range: '6-10d', activities: 27, color: '#3b82f6' },
                                { range: '>10d', activities: 18, color: '#10b981' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Activities Analyzed:</span>
                          <div className="font-semibold text-lg">80 activities</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Near-critical (≤5d float):</span>
                          <div className="font-semibold text-lg text-amber-600">50% (40 activities)</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Critical (0-2d float):</span>
                          <div className="font-semibold text-lg text-red-600">15% (12 activities)</div>
                        </div>
                      </div>

                      {/* Logic Explanation */}
                      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                        <span className="font-semibold">Logic:</span> Activities are grouped by their total float (slack). Float is calculated as the difference between early finish and late finish dates. Lower float indicates activities on or near the critical path, requiring tighter control and risk management.
                      </div>

                      {/* Critical & Near-Critical Path Activities Table */}
                      <div className="mt-8">
                        <h3 className="font-semibold mb-4">Critical & Near-Critical Path Activities</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Path</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Dependencies</TableHead>
                                <TableHead>Float</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">SD Phase - Schematic Design</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Mar 1, 2024</TableCell>
                                <TableCell>Jun 15, 2024</TableCell>
                                <TableCell>—</TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Zoning Variance Review</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>May 1, 2024</TableCell>
                                <TableCell>Jun 30, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">SD Phase - Schematic Design</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Design Coordination - Structure</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jul 1, 2024</TableCell>
                                <TableCell>Aug 31, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Procurement - Elevators</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jul 1, 2024</TableCell>
                                <TableCell>Sep 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">DD Phase - Design Development</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jun 15, 2024</TableCell>
                                <TableCell>Oct 1, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">SD Phase - Schematic Design</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Utility Coordination</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 1, 2024</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Design Coordination - MEP</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 15, 2024</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Environmental Permits</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 15, 2024</TableCell>
                                <TableCell>Oct 31, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Design Coordination - Envelope</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 1, 2024</TableCell>
                                <TableCell>Nov 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Procurement - Switchgear</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 1, 2024</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">GC/CM Selection</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 1, 2024</TableCell>
                                <TableCell>Oct 31, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Geotechnical Investigation Review</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 5, 2024</TableCell>
                                <TableCell>Sep 25, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Procurement - Curtainwall</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 10, 2024</TableCell>
                                <TableCell>Nov 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Building Permit Application</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 15, 2024</TableCell>
                                <TableCell>Nov 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Trade Contractor Prequalification</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 15, 2024</TableCell>
                                <TableCell>Nov 30, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">AHJ Plan Review - Set 1</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 20, 2024</TableCell>
                                <TableCell>Oct 10, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">CD Phase - Construction Documents</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Procurement - Generators</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 20, 2024</TableCell>
                                <TableCell>Nov 20, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Owner Equipment Selections</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Sep 25, 2024</TableCell>
                                <TableCell>Nov 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">CD Phase - Construction Documents</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 1, 2024</TableCell>
                                <TableCell>Jan 15, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Preconstruction Meeting Series</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 1, 2024</TableCell>
                                <TableCell>Dec 31, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">CD Phase - Construction Documents</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Procurement - AHUs</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 5, 2024</TableCell>
                                <TableCell>Dec 5, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">CD Phase - Construction Documents</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Site Logistics Planning</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 10, 2024</TableCell>
                                <TableCell>Dec 10, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">CD Phase - Construction Documents</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">AHJ Plan Review - Set 2</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell>Dec 15, 2024</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">AHJ Plan Review - Set 1</Badge></TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Long-Lead Submittal Review</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Oct 20, 2024</TableCell>
                                <TableCell>Jan 20, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">CD Phase - Construction Documents</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Foundation Excavation</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Structure & Core</TableCell>
                                <TableCell>Nov 1, 2024</TableCell>
                                <TableCell>Dec 15, 2024</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs mr-1">Building Permit Application</Badge>
                                  <Badge variant="secondary" className="text-xs">AHJ Plan Review - Set 2</Badge>
                                </TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Foundation Concrete</div>
                                </TableCell>
                                <TableCell>Structure & Core</TableCell>
                                <TableCell>Dec 16, 2024</TableCell>
                                <TableCell>Jan 31, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Foundation Excavation</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Structural Steel Frame</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Structure & Core</TableCell>
                                <TableCell>Feb 1, 2025</TableCell>
                                <TableCell>May 15, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Foundation Concrete</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Core Walls & Shafts</div>
                                </TableCell>
                                <TableCell>Structure & Core</TableCell>
                                <TableCell>Feb 15, 2025</TableCell>
                                <TableCell>Jun 15, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Foundation Concrete</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Electrical Service</div>
                                </TableCell>
                                <TableCell>MEP Rough-In</TableCell>
                                <TableCell>Apr 1, 2025</TableCell>
                                <TableCell>May 31, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Structural Steel Frame</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">HVAC Ductwork</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>MEP Rough-In</TableCell>
                                <TableCell>Apr 15, 2025</TableCell>
                                <TableCell>Jul 31, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Structural Steel Frame</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Plumbing Rough-In</div>
                                </TableCell>
                                <TableCell>MEP Rough-In</TableCell>
                                <TableCell>May 1, 2025</TableCell>
                                <TableCell>Aug 15, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Structural Steel Frame</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Slab-on-Grade</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Structure & Core</TableCell>
                                <TableCell>May 16, 2025</TableCell>
                                <TableCell>Jun 15, 2025</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs mr-1">Structural Steel Frame</Badge>
                                  <Badge variant="secondary" className="text-xs">Core Walls & Shafts</Badge>
                                </TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Fire Protection</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>MEP Rough-In</TableCell>
                                <TableCell>Jun 1, 2025</TableCell>
                                <TableCell>Sep 30, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">HVAC Ductwork</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">1d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Glazing</div>
                                </TableCell>
                                <TableCell>Envelope</TableCell>
                                <TableCell>Jun 1, 2025</TableCell>
                                <TableCell>Sep 30, 2025</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">Procurement - Curtainwall</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Electrical Rough-In</div>
                                </TableCell>
                                <TableCell>MEP Rough-In</TableCell>
                                <TableCell>Jul 1, 2025</TableCell>
                                <TableCell>Sep 30, 2025</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs mr-1">Electrical Service</Badge>
                                  <Badge variant="secondary" className="text-xs">HVAC Ductwork</Badge>
                                </TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">Final Inspections</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Interior Fit-Out</TableCell>
                                <TableCell>Nov 15, 2025</TableCell>
                                <TableCell>Dec 15, 2025</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs mr-1">Long-Lead Submittal Review</Badge>
                                  <Badge variant="secondary" className="text-xs">Value Engineering Review</Badge>
                                </TableCell>
                                <TableCell><span className="text-red-600 font-semibold">0d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-300">Upcoming</Badge></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Constraint Readiness Section */}
                      <div className="mt-8">
                        <h3 className="font-semibold mb-4">Constraint Readiness</h3>
                        <div className="bg-muted/30 rounded-lg p-6">
                          <div className="flex items-start gap-8">
                            {/* Donut Chart */}
                            <div className="flex-shrink-0">
                              <ResponsiveContainer width={180} height={180}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Confirmed', value: 68, color: '#10b981' },
                                      { name: 'Missing', value: 32, color: '#ef4444' }
                                    ]}
                                    cx={90}
                                    cy={90}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                  >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#ef4444" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="text-center -mt-28">
                                <div className="text-4xl font-bold">68%</div>
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-4">
                                Of critical/near-critical work has inputs confirmed
                              </p>
                              <div className="space-y-2">
                                <p className="font-semibold text-sm">Top 5 Missing Inputs:</p>
                                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                                  <li>Electrical service approval</li>
                                  <li>Curtainwall submittal approval</li>
                                  <li>Generator sizing confirmation</li>
                                  <li>Space access windows</li>
                                  <li>Long-lead PO approvals</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Long-Lead & Risked Items Section */}
            <Collapsible open={isLongLeadOpen} onOpenChange={setIsLongLeadOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Long-Lead & Risked Items
                      </CardTitle>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isLongLeadOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      Are we exposing the schedule to procurement and approvals risk?
                    </p>
                    
                    <div className="space-y-8">
                      {/* Long-Lead Tracker */}
                      <div>
                        <h3 className="font-semibold mb-4">Long-Lead Tracker</h3>
                        <div className="space-y-3">
                          {/* Switchgear */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Switchgear</div>
                                <div className="text-sm text-muted-foreground">Need-by: Jan 15, 2025</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Lead: 16 weeks</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Status: PO Placed</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-amber-600">+14d slack</span>
                              </div>
                            </div>
                          </div>

                          {/* Curtainwall */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Curtainwall</div>
                                <div className="text-sm text-muted-foreground">Need-by: Dec 1, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Lead: 20 weeks</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Status: In Fabrication</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-green-600">+21d slack</span>
                              </div>
                            </div>
                          </div>

                          {/* AHUs */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">AHUs</div>
                                <div className="text-sm text-muted-foreground">Need-by: Feb 1, 2025</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Lead: 14 weeks</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Status: Not Released</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-red-600">-5d slack</span>
                              </div>
                            </div>
                          </div>

                          {/* Generators */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Generators</div>
                                <div className="text-sm text-muted-foreground">Need-by: Jan 1, 2025</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Lead: 18 weeks</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Status: PO Placed</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-amber-600">+8d slack</span>
                              </div>
                            </div>
                          </div>

                          {/* Elevators */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Elevators</div>
                                <div className="text-sm text-muted-foreground">Need-by: Nov 15, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Lead: 24 weeks</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Status: Shipped</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-green-600">+35d slack</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Owner/Authority Decisions Board */}
                      <div>
                        <h3 className="font-semibold mb-4">Owner/Authority Decisions Board</h3>
                        <div className="space-y-3">
                          {/* Finalize Electrical Service Design */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Finalize Electrical Service Design</div>
                                <div className="text-sm text-muted-foreground">Due: Oct 10, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 14 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Owner</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge variant="destructive" className="text-xs">high</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Approve Curtainwall System Design */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Approve Curtainwall System Design</div>
                                <div className="text-sm text-muted-foreground">Due: Oct 5, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 7 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Designer</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge className="text-xs bg-amber-500 hover:bg-amber-600">medium</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Confirm Generator Sizing */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Confirm Generator Sizing</div>
                                <div className="text-sm text-muted-foreground">Due: Sep 30, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 21 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Owner</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge variant="destructive" className="text-xs">high</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Approve HVAC System Selection */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Approve HVAC System Selection</div>
                                <div className="text-sm text-muted-foreground">Due: Oct 15, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 10 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Owner</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge className="text-xs bg-amber-500 hover:bg-amber-600">medium</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Select Interior Finishes */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Select Interior Finishes</div>
                                <div className="text-sm text-muted-foreground">Due: Nov 1, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 5 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Owner</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge className="text-xs bg-green-600 hover:bg-green-700">low</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Finalize Site Access Agreements */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-semibold">Finalize Site Access Agreements</div>
                                <div className="text-sm text-muted-foreground">Due: Oct 20, 2024</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Impact: 12 days</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Owner: Owner</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">Affects: Design & Preconstruction</div>
                              </div>
                              <div>
                                <Badge variant="destructive" className="text-xs">high</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Look-Ahead Schedule Section */}
            <Collapsible open={isLookAheadOpen} onOpenChange={setIsLookAheadOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        Look-Ahead Schedule
                      </CardTitle>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isLookAheadOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">
                      What's next and are we truly ready?
                    </p>
                    
                    <div className="space-y-6">
                      {/* Look-Ahead Period Controls */}
                      <div className="bg-muted/30 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Look-Ahead Period</h3>
                          <div className="flex gap-2">
                            <Button 
                              variant={lookAheadPeriod === "7days" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setLookAheadPeriod("7days")}
                            >
                              7 Days
                            </Button>
                            <Button 
                              variant={lookAheadPeriod === "2weeks" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setLookAheadPeriod("2weeks")}
                            >
                              2 Weeks
                            </Button>
                            <Button 
                              variant={lookAheadPeriod === "1month" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setLookAheadPeriod("1month")}
                            >
                              1 Month
                            </Button>
                            <Button 
                              variant={lookAheadPeriod === "quarter" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setLookAheadPeriod("quarter")}
                            >
                              Quarter
                            </Button>
                          </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Total Activities</div>
                            <div className="text-3xl font-bold">7</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                            <div className="text-3xl font-bold text-green-600">3</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">In Progress</div>
                            <div className="text-3xl font-bold text-blue-600">4</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Critical/Near-Critical</div>
                            <div className="text-3xl font-bold text-amber-600">7</div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Period: <span className="font-semibold">Aug 15, 2024 → Aug 29, 2024</span>
                        </div>
                      </div>

                      {/* Activities in Look-Ahead Period */}
                      <div>
                        <h3 className="font-semibold mb-4">Activities in Look-Ahead Period</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead>Path</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead>End</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Dependencies</TableHead>
                                <TableHead>Float</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Design Coordination - Structure</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jul 1, 2024</TableCell>
                                <TableCell>Aug 31, 2024</TableCell>
                                <TableCell>61 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Procurement - Elevators</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jul 1, 2024</TableCell>
                                <TableCell>Sep 15, 2024</TableCell>
                                <TableCell>76 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">5d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Value Engineering Review</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jul 15, 2024</TableCell>
                                <TableCell>Sep 15, 2024</TableCell>
                                <TableCell>62 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">7d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-300">Completed</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">DD Phase - Design Development</div>
                                    <div className="text-xs text-red-600 font-semibold">Critical</div>
                                  </div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Jun 15, 2024</TableCell>
                                <TableCell>Oct 1, 2024</TableCell>
                                <TableCell>108 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">SD Phase - Schematic Design</Badge></TableCell>
                                <TableCell><span className="text-orange-600 font-semibold">2d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Utility Coordination</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 1, 2024</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell>75 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Design Coordination - MEP</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 15, 2024</TableCell>
                                <TableCell>Oct 15, 2024</TableCell>
                                <TableCell>61 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">3d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium">Environmental Permits</div>
                                </TableCell>
                                <TableCell>Design & Preconstruction</TableCell>
                                <TableCell>Aug 15, 2024</TableCell>
                                <TableCell>Oct 31, 2024</TableCell>
                                <TableCell>77 days</TableCell>
                                <TableCell><Badge variant="secondary" className="text-xs">DD Phase - Design Development</Badge></TableCell>
                                <TableCell><span className="font-semibold">4d</span></TableCell>
                                <TableCell><Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">Current</Badge></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        )}

        {activeModule === "workspace" && (
          <div className="container px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Schedule Workspace</h2>
            <p className="text-muted-foreground">Content coming soon...</p>
          </div>
        )}

        {activeModule === "basis" && (
          <div className="container px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Basis of Schedule (BoS)</h2>
            <p className="text-muted-foreground">Content coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
                    <p className="text-sm text-muted-foreground">Content coming soon...</p>
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
                    <p className="text-sm text-muted-foreground">Content coming soon...</p>
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

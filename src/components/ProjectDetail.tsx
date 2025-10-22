import { DataEngine } from "./DataEngine";
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
  FileText, BarChart3, Clock, Users, PanelRightClose, PanelRightOpen,
  TrendingDown, Flag, Banknote, Scale, Clipboard, Wrench
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTabContext } from "@/contexts/TabContext";
import { DesignStudio } from "./DesignStudio";
import { AutomationHub } from "./AutomationHub";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [selectedCostView, setSelectedCostView] = useState("s-curve");
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
                {/* Welcome Banner */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                      SC
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">
                        Welcome back, Sarah Chen
                      </h1>
                      <p className="text-sm text-muted-foreground mb-2">Project Manager (PM)</p>
                      <p className="text-sm text-muted-foreground">
                        Your project dashboard is updated with the latest cost data and schedule insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                  {/* Left Column - Project Details & Status */}
                  <div className="space-y-6">
                    {/* Project Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold">Downtown Office Complex</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-semibold">PRJ-2024-001</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-semibold">Commercial Office</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-semibold">125,000 sq ft</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-semibold">$50.0M</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-semibold">2024-12-15</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Overall Health:</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Track</Badge>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Budget Status:</span>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Within Budget</Badge>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Schedule Status:</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Time</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Executive Summary */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Executive Summary</CardTitle>
                      <span className="text-sm text-muted-foreground">↗ Last updated 2024-01-15</span>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Cost & Schedule:</span>
                        <span className="text-right font-medium">Under budget by $2.1M; Running 5 days behind schedule</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Current Phase:</span>
                        <span className="font-medium">Foundation & Structure</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Scope Changes:</span>
                        <span className="text-right font-medium">8 approved ($4.2M), 3 pending ($1.5M)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Cashflow:</span>
                        <span className="text-right font-medium">This period $3.8M Actual / $4.2M Planned; This period 90% of Planned</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Last Completed:</span>
                        <span className="font-medium">Foundation Complete (2024-01-10)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Next Milestone:</span>
                        <span className="font-medium">Steel Frame Start (2024-01-25)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Decision Needed:</span>
                        <span className="text-right font-medium text-red-600">Approve steel escalation contingency (due 2024-01-20, J. Smith)</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Signals:</span>
                        <span className="text-right font-medium">SPI: 0.95 (↓), CPI: 1.02 (↑), Market: Steel +12% (↑)</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* What Changed This Period */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle>What Changed This Period?</CardTitle>
                        <span className="text-sm text-muted-foreground">Last 30 days</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">7d</Button>
                        <Button variant="outline" size="sm">30d</Button>
                        <Button variant="outline" size="sm">Quarter</Button>
                        <Button variant="outline" size="sm">Custom</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* New Commitments */}
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">4</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">New Commitments</div>
                        <div className="text-lg font-bold">$2.5M</div>
                      </div>

                      {/* Approved Change Orders */}
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">3</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Approved Change Orders</div>
                        <div className="text-lg font-bold">$1.3M</div>
                      </div>

                      {/* Invoices Processed */}
                      <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">12</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Invoices Processed</div>
                        <div className="text-lg font-bold">$3.8M</div>
                      </div>

                      {/* Budget Transfers */}
                      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-600 mb-2">
                          <span className="text-sm font-semibold">→ 2</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Budget Transfers</div>
                        <div className="text-lg font-bold">$500k</div>
                      </div>

                      {/* Schedule Movement */}
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-red-600 mb-2">
                          <span className="text-sm font-semibold">↘ 1</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Schedule Movement</div>
                        <div className="text-lg font-bold">-5d</div>
                      </div>

                      {/* Milestones Updated */}
                      <div className="bg-teal-50 dark:bg-teal-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-teal-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">1</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Milestones Updated</div>
                        <div className="text-lg font-bold">+1</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule and Cost Overview */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                  {/* Schedule Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Schedule Overview</CardTitle>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B0</Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B1</Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B2</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300 px-4 py-2 rounded text-sm">
                        Running 5 days behind schedule
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Baseline</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Actual %</span>
                          </div>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={[
                            { month: 'Jan 25', baseline: 5, actual: 5 },
                            { month: 'Feb 25', baseline: 12, actual: 10 },
                            { month: 'Mar 25', baseline: 25, actual: 20 },
                            { month: 'Apr 25', baseline: 45, actual: 38 },
                            { month: 'May 25', baseline: 65, actual: 58 },
                            { month: 'Jun 25', baseline: 78, actual: 72 },
                            { month: 'Jul 25', baseline: 88, actual: 83 },
                            { month: 'Aug 25', baseline: 100, actual: 95 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              label={{ value: '%', angle: 0, position: 'top' }}
                            />
                            <Tooltip />
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
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Upcoming Milestones</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Foundation Complete</span>
                            <span className="text-muted-foreground">2024-01-10</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Steel Frame Start</span>
                            <span className="text-green-600">2024-01-25 -2d</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Steel Frame Complete</span>
                            <span className="text-red-600">2024-03-15 +3d</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Overview */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Cost Overview</CardTitle>
                        <select 
                          className="text-sm border rounded px-2 py-1 bg-background"
                          value={selectedCostView}
                          onChange={(e) => setSelectedCostView(e.target.value)}
                        >
                          <option value="s-curve">📊 S-Curve</option>
                          <option value="contingency-drawdown">💰 Contingency Drawdown</option>
                          <option value="cost-position">🏁 Cost Position</option>
                          <option value="cash-flow">💵 Cash Flow</option>
                          <option value="contingency-balance">⚖️ Contingency Balance</option>
                          <option value="change-orders">📋 Change Orders</option>
                          <option value="trade-budget">🔧 Trade Budget</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Common metrics for all views */}
                      <div className="grid grid-cols-5 gap-4 pb-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Budget</div>
                          <div className="text-xl font-bold">$45.8M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Commitments</div>
                          <div className="text-xl font-bold">$41.9M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Invoiced</div>
                          <div className="text-xl font-bold">$23.0M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Forecast</div>
                          <div className="text-xl font-bold">$42.6M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Contingency</div>
                          <div className="text-xl font-bold">$2.3M</div>
                        </div>
                      </div>

                      {/* S-Curve View */}
                      {selectedCostView === "s-curve" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div>
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <span className="ml-2 font-semibold text-red-600">91%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <span className="ml-2 font-semibold text-green-600">93%</span>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-xs flex-wrap">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Approved Budget</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span>Committed</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Invoiced</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span>Planned Cashflow</span>
                              </div>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={[
                                { month: 'Jan 25', budget: 45800000, committed: 2000000, invoiced: 1500000, cashflow: 2500000 },
                                { month: 'Feb 25', budget: 45800000, committed: 5000000, invoiced: 3500000, cashflow: 6000000 },
                                { month: 'Mar 25', budget: 45800000, committed: 10000000, invoiced: 7000000, cashflow: 12000000 },
                                { month: 'Apr 25', budget: 45800000, committed: 18000000, invoiced: 12000000, cashflow: 20000000 },
                                { month: 'May 25', budget: 45800000, committed: 27000000, invoiced: 16000000, cashflow: 30000000 },
                                { month: 'Jun 25', budget: 45800000, committed: 35000000, invoiced: 20000000, cashflow: 38000000 },
                                { month: 'Jul 25', budget: 45800000, committed: 40000000, invoiced: 22000000, cashflow: 43000000 },
                                { month: 'Aug 25', budget: 45800000, committed: 41900000, invoiced: 23000000, cashflow: 45800000 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="budget" 
                                  stroke="#3b82f6" 
                                  strokeWidth={2}
                                  dot={{ fill: '#3b82f6', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="cashflow" 
                                  stroke="#06b6d4" 
                                  strokeWidth={2}
                                  dot={{ fill: '#06b6d4', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="committed" 
                                  stroke="#f97316" 
                                  strokeWidth={2}
                                  dot={{ fill: '#f97316', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="invoiced" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  dot={{ fill: '#10b981', r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}

                      {/* Contingency Drawdown View */}
                      {selectedCostView === "contingency-drawdown" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={[
                                { month: 'Jan 25', percentage: 100 },
                                { month: 'Feb 25', percentage: 98 },
                                { month: 'Mar 25', percentage: 95 },
                                { month: 'Apr 25', percentage: 92 },
                                { month: 'May 25', percentage: 88 },
                                { month: 'Jun 25', percentage: 84 },
                                { month: 'Jul 25', percentage: 80 },
                                { month: 'Aug 25', percentage: 76 }
                              ]}>
                                <defs>
                                  <linearGradient id="contingencyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  domain={[0, 100]}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `${value}%`}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="percentage" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  fill="url(#contingencyGradient)"
                                  dot={{ fill: '#10b981', r: 4 }}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                            <p className="text-center text-sm text-muted-foreground">Contingency Drawdown Over Time</p>
                          </div>
                        </>
                      )}

                      {/* Cost Position View */}
                      {selectedCostView === "cost-position" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Total Cost Position – Funding vs EAC</h4>
                              <span className="text-sm text-muted-foreground">USD</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { name: 'Original Budget', amount: 22000000 },
                                  { name: 'Approved Changes', amount: 1800000 },
                                  { name: 'Current Budget', amount: 23800000 },
                                  { name: 'Committed', amount: 18900000 },
                                  { name: 'Invoiced', amount: 10500000 },
                                  { name: 'Forecast to Complete', amount: 6400000 },
                                  { name: 'EAC', amount: 16900000 }
                                ]}
                                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="name" 
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                  interval={0}
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar 
                                  dataKey="amount" 
                                  fill="#3b82f6" 
                                  radius={[4, 4, 0, 0]}
                                  label={{ 
                                    position: 'top', 
                                    formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
                                    fill: 'hsl(var(--foreground))',
                                    fontSize: 11
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-2 text-xs">
                              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                              <span className="text-muted-foreground">Amount</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Cash Flow View */}
                      {selectedCostView === "cash-flow" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Cash Flow – Plan vs Actual vs Forecast</h4>
                              <span className="text-sm text-muted-foreground">Monthly + cumulative S-curves</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { month: '01', actual: 2000000, forecast: 1800000, planned: 2500000, cumActual: 2000000, cumPlan: 2500000 },
                                  { month: '02', actual: 3500000, forecast: 3200000, planned: 4000000, cumActual: 5500000, cumPlan: 6500000 },
                                  { month: '03', actual: 5000000, forecast: 4500000, planned: 6000000, cumActual: 10500000, cumPlan: 12500000 },
                                  { month: '04', actual: 7000000, forecast: 6500000, planned: 8000000, cumActual: 17500000, cumPlan: 20500000 },
                                  { month: '05', actual: 9000000, forecast: 8500000, planned: 10000000, cumActual: 26500000, cumPlan: 30500000 },
                                  { month: '06', actual: 11000000, forecast: 10500000, planned: 12000000, cumActual: 37500000, cumPlan: 42500000 },
                                  { month: '07', actual: 13000000, forecast: 12500000, planned: 14000000, cumActual: 50500000, cumPlan: 56500000 },
                                  { month: '08', actual: 0, forecast: 15000000, planned: 16000000, cumActual: 50500000, cumPlan: 72500000 }
                                ]}
                                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  yAxisId="left"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                                />
                                <YAxis 
                                  yAxisId="right"
                                  orientation="right"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar yAxisId="left" dataKey="actual" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="forecast" fill="#93c5fd" name="Forecast" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="planned" fill="#bfdbfe" name="Planned" radius={[4, 4, 0, 0]} />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="cumActual" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  dot={{ fill: '#10b981', r: 3 }}
                                  name="Cum Actual"
                                />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="cumPlan" 
                                  stroke="#374151" 
                                  strokeWidth={2}
                                  dot={{ fill: '#374151', r: 3 }}
                                  name="Cum Plan"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                <span>Actual</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                <span>Cum Actual</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                <span>Cum Plan</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                                <span>Forecast</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                                <span>Planned</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Contingency Balance View */}
                      {selectedCostView === "contingency-balance" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Contingency & Allowances – Balance & Burn</h4>
                              <span className="text-sm text-muted-foreground">With pending exposure</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { category: 'Original\nContingency', balance: 2500000, burned: 0 },
                                  { category: 'Weather\nDelays', balance: 0, burned: -400000 },
                                  { category: 'Steel\nEscalation', balance: 0, burned: -500000 },
                                  { category: 'Design\nChanges', balance: 0, burned: -300000 },
                                  { category: 'Remaining', balance: 1300000, burned: 0 }
                                ]}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 120, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  type="number"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                  domain={[-800000, 3000000]}
                                />
                                <YAxis 
                                  dataKey="category"
                                  type="category"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  width={110}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(Math.abs(value) / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar 
                                  dataKey="balance" 
                                  fill="#f59e0b" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                  dataKey="burned" 
                                  fill="#fbbf24" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Risks and Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Risks */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Risks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Risk Heat Map */}
                        <div>
                          <h4 className="font-semibold mb-3">Risk Heat Map</h4>
                          <div className="space-y-1">
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">HI</div>
                              <div className="bg-green-100 dark:bg-green-950/30 p-2 text-center rounded relative">
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-red-100 dark:bg-red-950/30 p-2 text-center rounded relative">
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">MI</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-yellow-100 dark:bg-yellow-950/30 p-2 text-center rounded relative">
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">LI</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground text-center pt-2">
                              <div></div>
                              <div>LP</div>
                              <div>MP</div>
                              <div>HP</div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                            <div>HI=High Impact, MI=Medium Impact, LI=Low Impact</div>
                            <div>LP=Low Probability, MP=Medium Probability, HP=High Probability</div>
                          </div>
                          <div className="mt-3 flex gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-100 dark:bg-green-950/30 rounded"></div>
                              <span>Green (Low)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-950/30 rounded"></div>
                              <span>Amber (Medium)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span>Active Risk</span>
                            </div>
                          </div>
                        </div>

                        {/* Risk Summary */}
                        <div>
                          <h4 className="font-semibold mb-3">Risk Summary</h4>
                          <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground">
                            Select a cell to see details here.
                          </div>
                        </div>
                      </div>

                      {/* Top Risks */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Top Risks</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">Steel escalation +12%</div>
                              <div className="text-xs text-muted-foreground">J. Smith • Due 2024-01-20</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">High</Badge>
                              <Badge variant="destructive">High</Badge>
                              <span className="font-semibold">$2.5M</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">Permit delay risk</div>
                              <div className="text-xs text-muted-foreground">M. Johnson • Due 2024-02-01</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
                              <span className="font-semibold">14d</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">Labor shortage</div>
                              <div className="text-xs text-muted-foreground">R. Davis • Due 2024-03-15</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
                              <Badge variant="destructive">High</Badge>
                              <span className="font-semibold">$500k</span>
                              <span className="text-muted-foreground">7d</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <FileText className="h-4 w-4 text-red-600" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Set Alerts
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Users className="h-4 w-4 text-gray-600" />
                        Configure Settings
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
              <AutomationHub />
            </TabsContent>

            {/* Procurement Tab */}
            <TabsContent value="procurement" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Procurement</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Data Engine Tab */}
            <TabsContent value="data" className="mt-0 h-[calc(100vh-200px)]">
              <DataEngine />
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
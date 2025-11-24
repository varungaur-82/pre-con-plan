import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line } from "recharts";
import { Settings, Minus, Plus, Info, ExternalLink, ChevronDown, HelpCircle, Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function ProcurementSnapshot() {
  const [activeTab, setActiveTab] = useState("snapshot");
  const [baseline, setBaseline] = useState("baseline");
  const [ddVersion, setDdVersion] = useState("dd");
  const [riskAppetite, setRiskAppetite] = useState("balanced");
  const [panelCount, setPanelCount] = useState(2);

  // Long-Lead Risk Matrix Data
  const riskMatrixData = [
    { x: 2, y: 8, risk: 'high', package: 'Elevators' },
    { x: -2, y: 8, risk: 'high', package: 'Switchgear' },
    { x: 1, y: 8, risk: 'high', package: 'Curtainwall' },
    { x: 4, y: 5, risk: 'medium', package: 'MEP Equipment' },
    { x: 3, y: 5, risk: 'medium', package: 'Generators' },
    { x: 5, y: 2, risk: 'low', package: 'Structural Steel' },
  ];

  // Market Pressure Index Data
  const marketPressureData = [
    { category: 'Steel', value: 112 },
    { category: 'Electrical', value: 108 },
    { category: 'Mechanical', value: 105 },
    { category: 'Labor', value: 110 },
    { category: 'Freight', value: 115 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b bg-card px-6">
          <TabsList className="bg-transparent h-12 p-0">
            <TabsTrigger 
              value="snapshot" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4"
            >
              Snapshot
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4"
            >
              Strategy & Market
            </TabsTrigger>
            <TabsTrigger 
              value="scenarios" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4"
            >
              5D Scenarios
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="snapshot" className="flex-1 m-0 overflow-y-auto">
          {/* Filter Controls */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <Select value={baseline} onValueChange={setBaseline}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Baseline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ddVersion} onValueChange={setDdVersion}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="DD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd">DD</SelectItem>
                  <SelectItem value="cd">CD</SelectItem>
                  <SelectItem value="sd">SD</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground mr-2">Risk Appetite:</span>
                <Button
                  variant={riskAppetite === 'averse' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('averse')}
                  className="text-xs"
                >
                  Risk Averse
                </Button>
                <Button
                  variant={riskAppetite === 'balanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('balanced')}
                  className="text-xs"
                >
                  Balanced
                </Button>
                <Button
                  variant={riskAppetite === 'aggressive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('aggressive')}
                  className="text-xs"
                >
                  Aggressive
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Procurement Snapshot</h1>
                <p className="text-muted-foreground">Owner-level overview of procurement health</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last synced from 5D: 24/11/2025, 12:20:28</p>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-5 gap-4">
              {/* Procurement Risk Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Procurement Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-destructive">75</span>
                    <span className="text-muted-foreground">/ 100</span>
                  </div>
                </CardContent>
              </Card>

              {/* Long-Lead Exposure */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Long-Lead Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-construction-success mb-1">6 packages</div>
                  <p className="text-xs text-muted-foreground">3 high-risk</p>
                </CardContent>
              </Card>

              {/* Design Readiness */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Design Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-construction-success mb-1">71%</div>
                  <p className="text-xs text-muted-foreground">Avg. maturity for long-leads</p>
                </CardContent>
              </Card>

              {/* Market Pressure */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Market Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-construction-success mb-1">High</div>
                  <p className="text-xs text-muted-foreground">Steel +8%, MEP constrained</p>
                </CardContent>
              </Card>

              {/* 90-Day Outlook */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    90-Day Outlook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-construction-success mb-1">4 freezes</div>
                  <p className="text-xs text-muted-foreground">3 order-by deadlines, 1 at risk</p>
                </CardContent>
              </Card>
            </div>

            {/* Panels Control */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Panes:</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setPanelCount(Math.max(1, panelCount - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">{panelCount}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setPanelCount(Math.min(4, panelCount + 1))}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reset Layout
                </Button>
                <Button variant="outline" size="sm">
                  Show Chart Library
                </Button>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Long-Lead Risk Matrix */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Long-Lead Risk Matrix</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        domain={[-4, 6]}
                        ticks={[-2, 2, 4]}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        domain={[0, 10]}
                        ticks={[0, 2, 4, 6, 8]}
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border rounded-lg p-2 shadow-lg">
                                <p className="font-medium">{data.package}</p>
                                <p className="text-xs text-muted-foreground capitalize">{data.risk} risk</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter data={riskMatrixData}>
                        {riskMatrixData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Market Pressure Index */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Market Pressure Index</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={marketPressureData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Active Procurement Strategies & Design Freeze Timeline */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Procurement Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Procurement Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strategy 1 */}
                  <div className="border-l-4 border-construction-success pl-4 pb-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">Early order: steel, switchgear, elevators</p>
                      </div>
                      <Badge className="bg-construction-success/10 text-construction-success hover:bg-construction-success/20">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Cost: +1.5%
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Schedule: -3 weeks
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                        Risk: -5
                      </Badge>
                    </div>
                  </div>

                  {/* Strategy 2 */}
                  <div className="border-l-4 border-amber-500 pl-4 pb-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">Design-Assist: Envelope and MEP during DD</p>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200">
                        Draft
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Cost: +0.5%
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Schedule: -2 weeks
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                        Risk: -3
                      </Badge>
                    </div>
                  </div>

                  {/* Strategy 3 */}
                  <div className="border-l-4 border-amber-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">Bundled procurement: HVAC and electrical</p>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200">
                        Draft
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Cost: -0.2%
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        Schedule: -1 week
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                        Risk: -2
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground italic pt-2">
                    Strategy aims to recover 2–3 weeks float with ~1–2% cost uplift.
                  </p>
                </CardContent>
              </Card>

              {/* Design Freeze Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Design Freeze Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Timeline Item 1 */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-construction-success"></div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="font-medium">Structural Steel</p>
                            <p className="text-xs text-muted-foreground">Fabrication start</p>
                          </div>
                          <span className="text-xs text-muted-foreground">2024-03-15</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span>Bid: 15/03/2024</span>
                          <span className="mx-2">•</span>
                          <span>Award: 29/03/2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="font-medium">Curtain Wall</p>
                            <p className="text-xs text-muted-foreground">Manufacturing start</p>
                          </div>
                          <span className="text-xs text-muted-foreground">2024-03-30</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span>Bid: 30/03/2024</span>
                          <span className="mx-2">•</span>
                          <span>Award: 13/04/2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Item 3 */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="font-medium">Switchgear</p>
                            <p className="text-xs text-muted-foreground">Order placement</p>
                          </div>
                          <span className="text-xs text-muted-foreground">2024-04-01</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span>Bid: 01/04/2024</span>
                          <span className="mx-2">•</span>
                          <span>Award: 15/04/2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Item 4 - Today */}
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-medium">Today</p>
                          <span className="text-xs text-muted-foreground">2025-11-24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Snapshot */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Market Indices */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Market Indices</h3>
                  <div className="grid grid-cols-6 gap-4">
                    {/* Steel */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Steel</span>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                          Rising
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">108</div>
                      <div className="text-xs text-red-600">+8.0%</div>
                    </div>

                    {/* Electrical */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Electrical</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                          Volatile
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">105</div>
                      <div className="text-xs text-red-600">+2.9%</div>
                    </div>

                    {/* Mechanical */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Mechanical</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          Stable
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">103</div>
                      <div className="text-xs text-red-600">+2.0%</div>
                    </div>

                    {/* Labor */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Labor</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          Stable
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">107</div>
                      <div className="text-xs text-red-600">+1.9%</div>
                    </div>

                    {/* Freight */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Freight</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                          Volatile
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">112</div>
                      <div className="text-xs text-red-600">+1.8%</div>
                    </div>
                  </div>
                </div>

                {/* News Bulletin */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">News Bulletin</h3>
                    <Button variant="link" size="sm" className="text-xs text-primary">
                      <Info className="h-3 w-3 mr-1" />
                      Sources
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* News Item 1 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">Steel Prices Continue Upward Trend</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Q1 2024 shows 8% increase in structural steel costs
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-15</span>
                        <span className="text-xs font-medium">ENR</span>
                      </div>
                    </div>

                    {/* News Item 2 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">MEP Panel Supply Chain Constraints</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Extended lead times for electrical panels reported by major manufacturers
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-12</span>
                        <span className="text-xs font-medium">GC Reports</span>
                      </div>
                    </div>

                    {/* News Item 3 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">Labor Market Easing in Q2</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Increased availability of skilled trades expected
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-10</span>
                        <span className="text-xs font-medium">Industry News</span>
                      </div>
                    </div>

                    {/* News Item 4 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">Port Congestion in Region Y</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Increased container wait times at major ports
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-10</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                          medium severity
                        </Badge>
                      </div>
                    </div>

                    {/* News Item 5 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">Labor Easing in Region X</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Increased availability of skilled trades
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-08</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          low severity
                        </Badge>
                      </div>
                    </div>

                    {/* News Item 6 */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <p className="font-medium text-sm flex-1">MEP Panel Constraints</p>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <Info className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tight supply chain for electrical panels
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">2024-01-05</span>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                          high severity
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="flex-1 m-0 overflow-y-auto">
          {/* Filter Controls */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <Select value={baseline} onValueChange={setBaseline}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Baseline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ddVersion} onValueChange={setDdVersion}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="DD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd">DD</SelectItem>
                  <SelectItem value="cd">CD</SelectItem>
                  <SelectItem value="sd">SD</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground mr-2">Risk Appetite:</span>
                <Button
                  variant={riskAppetite === 'averse' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('averse')}
                  className="text-xs"
                >
                  Risk Averse
                </Button>
                <Button
                  variant={riskAppetite === 'balanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('balanced')}
                  className="text-xs"
                >
                  Balanced
                </Button>
                <Button
                  variant={riskAppetite === 'aggressive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRiskAppetite('aggressive')}
                  className="text-xs"
                >
                  Aggressive
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Strategy & Market</h1>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all-trades">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Trades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-trades">All Trades</SelectItem>
                    <SelectItem value="structure">Structure</SelectItem>
                    <SelectItem value="envelope">Envelope</SelectItem>
                    <SelectItem value="mep">MEP</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-risk">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Risk Bands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-risk">All Risk Bands</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Procurement Strategy Stack */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Procurement Strategy Stack</h2>
                <Button variant="outline" size="sm">
                  + Add Strategy
                </Button>
              </div>

              <div className="space-y-4">
                {/* Strategy 1 - Approved */}
                <Card className="bg-green-50/30 dark:bg-green-950/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">Early Order: Structural Steel</h3>
                          <Badge className="bg-construction-success text-white">Approved</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Place steel order 4 weeks ahead of baseline schedule to secure fabrication slot and lock pricing
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Phase:</span>
                            <span className="ml-1 font-medium">DD</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Trades:</span>
                            <span className="ml-1 font-medium">Structure</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                            Cost: +1.2%
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                            Schedule: -3 weeks
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                            Risk: -8
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Rationale: Steel prices rising 8% QoQ. Early order secures capacity and reduces price escalation risk.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategy 2 - Draft */}
                <Card className="bg-amber-50/30 dark:bg-amber-950/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">Design-Assist: Envelope & MEP</h3>
                          <Badge className="bg-amber-500 text-white">Draft</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Engage curtain wall and MEP manufacturers during DD phase for value engineering and early coordination
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Phase:</span>
                            <span className="ml-1 font-medium">DD</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Trades:</span>
                            <span className="ml-1 font-medium">Envelope, MEP</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                            Cost: -0.5%
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                            Schedule: -2 weeks
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                            Risk: -5
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Rationale: Design-assist reduces change orders and enables early procurement while design matures.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategy 3 - Proposed */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">Bundled Procurement: HVAC & Electrical</h3>
                          <Badge variant="outline" className="border-primary text-primary">Proposed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Package HVAC and electrical equipment together to leverage volume discounts and simplify coordination
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Phase:</span>
                            <span className="ml-1 font-medium">CD</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Trades:</span>
                            <span className="ml-1 font-medium">MEP</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                            Cost: -0.3%
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                            Schedule: 0 weeks
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                            Risk: -2
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Rationale: Single supplier relationship reduces coordination complexity and may provide cost savings.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strategy 4 - Approved */}
                <Card className="bg-green-50/30 dark:bg-green-950/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">Early Release: Elevators</h3>
                          <Badge className="bg-construction-success text-white">Approved</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Release elevator package immediately as design is 85% complete and lead time is 24 weeks
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Phase:</span>
                            <span className="ml-1 font-medium">DD</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <span className="text-muted-foreground">Trades:</span>
                            <span className="ml-1 font-medium">MEP</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                            Cost: 0%
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                            Schedule: -1 week
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                            Risk: -3
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Rationale: Design is ready and long lead time justifies early release to protect schedule.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Strategy Suggestions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">AI Strategy Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Suggestion 1 */}
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold mb-2">Early Release: Structural Steel</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Order 4 weeks early to secure fabrication slot
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cost: +1%, Schedule: -2 weeks
                  </p>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Accept</Button>
                    <Button variant="outline" size="sm">Dismiss</Button>
                  </div>
                </div>

                {/* Suggestion 2 */}
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold mb-2">Design-Assist: Curtain Wall</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Engage manufacturer during DD for value engineering
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cost: -0.5%, Schedule: -1 week
                  </p>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">Accept</Button>
                    <Button variant="outline" size="sm">Dismiss</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Long-Lead Packages & Design Dependencies */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Long-Lead Packages & Design Dependencies</h2>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Package / Trade</th>
                          <th className="text-left p-3 text-sm font-medium">Lead Time</th>
                          <th className="text-left p-3 text-sm font-medium">Required On-Site</th>
                          <th className="text-left p-3 text-sm font-medium">Safe Order Date</th>
                          <th className="text-left p-3 text-sm font-medium">Slack</th>
                          <th className="text-left p-3 text-sm font-medium">Design Maturity</th>
                          <th className="text-left p-3 text-sm font-medium">Spec Status</th>
                          <th className="text-left p-3 text-sm font-medium">Risk Band</th>
                          <th className="text-left p-3 text-sm font-medium">AI Next Step</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Structural Steel */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">Structural Steel</p>
                              <p className="text-xs text-muted-foreground">Structure</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">16 weeks</td>
                          <td className="p-3 text-sm">01/08/2024</td>
                          <td className="p-3 text-sm">15/04/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              +2w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-xs">75%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              review
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              High
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Finalize structural drawings and release for fabrication
                          </td>
                        </tr>

                        {/* Switchgear & Electrical Panels */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">Switchgear & Electrical Panels</p>
                              <p className="text-xs text-muted-foreground">MEP</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">20 weeks</td>
                          <td className="p-3 text-sm">15/09/2024</td>
                          <td className="p-3 text-sm">01/05/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              -2w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-xs">60%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                              draft
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              High
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Complete one-line diagrams and coordinate with utility
                          </td>
                        </tr>

                        {/* Elevators */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">Elevators</p>
                              <p className="text-xs text-muted-foreground">MEP</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">24 weeks</td>
                          <td className="p-3 text-sm">01/10/2024</td>
                          <td className="p-3 text-sm">15/04/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              +4w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                                </div>
                                <span className="text-xs">85%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              final
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              Medium
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Proceed with procurement - design is ready
                          </td>
                        </tr>

                        {/* Curtain Wall System */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">Curtain Wall System</p>
                              <p className="text-xs text-muted-foreground">Envelope</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">18 weeks</td>
                          <td className="p-3 text-sm">15/08/2024</td>
                          <td className="p-3 text-sm">30/04/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              +1w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: '70%' }}></div>
                                </div>
                                <span className="text-xs">70%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              review
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              High
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Finalize performance specs and thermal analysis
                          </td>
                        </tr>

                        {/* HVAC Equipment */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">HVAC Equipment</p>
                              <p className="text-xs text-muted-foreground">MEP</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">14 weeks</td>
                          <td className="p-3 text-sm">15/07/2024</td>
                          <td className="p-3 text-sm">15/04/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              +3w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: '80%' }}></div>
                                </div>
                                <span className="text-xs">80%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              review
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                              Medium
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Coordinate equipment sizing with load calculations
                          </td>
                        </tr>

                        {/* Precast Concrete Panels */}
                        <tr className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">Precast Concrete Panels</p>
                              <p className="text-xs text-muted-foreground">Structure</p>
                            </div>
                          </td>
                          <td className="p-3 text-sm">12 weeks</td>
                          <td className="p-3 text-sm">01/07/2024</td>
                          <td className="p-3 text-sm">15/04/2024</td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              +5w
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: '90%' }}></div>
                                </div>
                                <span className="text-xs">90%</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              final
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                              Low
                            </Badge>
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            Ready for procurement
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Design Blocking Issues */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Design Blocking Issues</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-full bg-destructive rounded-full"></div>
                      <p className="text-sm">
                        <span className="font-semibold">Switchgear & Electrical:</span>{" "}
                        <span className="text-muted-foreground">One-line diagram pending</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-full bg-destructive rounded-full"></div>
                      <p className="text-sm">
                        <span className="font-semibold">Switchgear & Electrical:</span>{" "}
                        <span className="text-muted-foreground">Utility coordination incomplete</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-full bg-destructive rounded-full"></div>
                      <p className="text-sm">
                        <span className="font-semibold">Curtain Wall:</span>{" "}
                        <span className="text-muted-foreground">Performance spec incomplete</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-full bg-destructive rounded-full"></div>
                      <p className="text-sm">
                        <span className="font-semibold">Curtain Wall:</span>{" "}
                        <span className="text-muted-foreground">Thermal analysis pending</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Conditions & Project Impact */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Market Conditions & Project Impact</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Indices & Direct Project Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Steel */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Steel</span>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                          Rising
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold">108</div>
                      <div className="text-sm text-red-600 font-medium">+8.0%</div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Affects: <span className="font-medium">0 packages</span></p>
                        <p className="text-xs text-muted-foreground">Est. Impact: <span className="font-medium text-red-600">$0K</span></p>
                      </div>
                    </div>

                    {/* Electrical */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Electrical</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                          Volatile
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold">105</div>
                      <div className="text-sm text-red-600 font-medium">+2.9%</div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Affects: <span className="font-medium">0 packages</span></p>
                        <p className="text-xs text-muted-foreground">Est. Impact: <span className="font-medium text-red-600">$0K</span></p>
                      </div>
                    </div>

                    {/* Mechanical */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mechanical</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          Stable
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold">103</div>
                      <div className="text-sm text-red-600 font-medium">+2.0%</div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Affects: <span className="font-medium">0 packages</span></p>
                        <p className="text-xs text-muted-foreground">Est. Impact: <span className="font-medium text-red-600">$0K</span></p>
                      </div>
                    </div>

                    {/* Labor */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Labor</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          Stable
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold">107</div>
                      <div className="text-sm text-red-600 font-medium">+1.9%</div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Affects: <span className="font-medium">0 packages</span></p>
                        <p className="text-xs text-muted-foreground">Est. Impact: <span className="font-medium text-red-600">$0K</span></p>
                      </div>
                    </div>

                    {/* Freight */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Freight</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                          Volatile
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold">112</div>
                      <div className="text-sm text-red-600 font-medium">+1.8%</div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Affects: <span className="font-medium">0 packages</span></p>
                        <p className="text-xs text-muted-foreground">Est. Impact: <span className="font-medium text-red-600">$0K</span></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mitigation Strategies */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Mitigation Strategies</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm">
                    Active mitigation strategies are displayed in the Procurement Strategy Stack above.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Events & Project Impact */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Market Events & Project Impact</h2>
              <div className="space-y-3">
                {/* Event 1 - Port Congestion */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Port Congestion in Region Y</h3>
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            medium severity
                          </Badge>
                          <button className="ml-auto text-muted-foreground hover:text-foreground">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Increased container wait times at major ports
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-10 • Region Y</p>
                        
                        <div className="mt-3 pl-4 border-l-4 border-primary/40">
                          <p className="text-sm font-medium mb-1">Project Impact:</p>
                          <p className="text-sm text-muted-foreground">Possible 1-2 week delays for imported materials</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event 2 - Labor Easing */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Labor Easing in Region X</h3>
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            low severity
                          </Badge>
                          <button className="ml-auto text-muted-foreground hover:text-foreground">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Increased availability of skilled trades
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-08 • Region X</p>
                        
                        <div className="mt-3 pl-4 border-l-4 border-primary/40">
                          <p className="text-sm font-medium mb-1">Project Impact:</p>
                          <p className="text-sm text-muted-foreground">Potential cost relief in Q4 2024</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event 3 - MEP Panel Constraints */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">MEP Panel Constraints</h3>
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            high severity
                          </Badge>
                          <button className="ml-auto text-muted-foreground hover:text-foreground">
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Tight supply chain for electrical panels
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-05 • National</p>
                        
                        <div className="mt-3 pl-4 border-l-4 border-primary/40">
                          <p className="text-sm font-medium mb-1">Project Impact:</p>
                          <p className="text-sm text-muted-foreground">Extended lead times, consider early ordering</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Logistics Exposure & Regional Risks */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Logistics Exposure & Regional Risks</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Curtain Wall System */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">Curtain Wall System</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                        Region Y
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-3 text-sm text-muted-foreground">
                      <p>• Port delays</p>
                      <p>• Customs clearance</p>
                    </div>
                    <p className="text-sm font-medium text-destructive mb-4">
                      Estimated Delay: <span className="font-bold">1 weeks</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Ask AI
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Add to Contingency
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Switchgear */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">Switchgear</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                        OEM Z
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-3 text-sm text-muted-foreground">
                      <p>• Lead times trending up</p>
                      <p>• Component shortages</p>
                    </div>
                    <p className="text-sm font-medium text-destructive mb-4">
                      Estimated Delay: <span className="font-bold">2 weeks</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Ask AI
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Add to Contingency
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="flex-1 m-0 overflow-y-auto">
          <div className="p-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Procurement Risk Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-destructive">72</span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Baseline: 72</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Long-Lead Exposure</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-construction-success">6</span>
                    <span className="text-sm">packages</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Baseline: 3 high-risk</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Design Readiness</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-construction-success">77%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Avg. maturity for long-leads</p>
                  <p className="text-xs text-muted-foreground">Baseline: 77%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Market Pressure</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-destructive">High</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Steel +8.0%, Electrical +2.9%</p>
                  <p className="text-xs text-muted-foreground">Baseline: High</p>
                </CardContent>
              </Card>
            </div>

            {/* Title and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">5D & What-If Scenarios</h2>
                <p className="text-sm text-muted-foreground">Simulate procurement decisions and see cost, schedule, and risk consequences</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value="baseline">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="scenario1">Scenario 1</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">Seed from Strategy Stack</Button>
                <Button variant="default" size="sm">+ New Scenario</Button>
                <Button variant="outline" size="sm">Show Comparison</Button>
              </div>
            </div>

            {/* Main Layout - Sidebar + Content */}
            <div className="flex gap-6">
              {/* Left Sidebar */}
              <div className="w-80 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {/* Project Delivery Method */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">Project Delivery Method</CardTitle>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <RadioGroup defaultValue="baseline">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="db" id="db" />
                        <Label htmlFor="db" className="text-sm cursor-pointer">DB</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cmar" id="cmar" />
                        <Label htmlFor="cmar" className="text-sm cursor-pointer">CMAR</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dbb" id="dbb" />
                        <Label htmlFor="dbb" className="text-sm cursor-pointer">DBB</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdb" id="pdb" />
                        <Label htmlFor="pdb" className="text-sm cursor-pointer">PDB</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="baseline" id="baseline" />
                        <Label htmlFor="baseline" className="text-sm cursor-pointer font-medium">Baseline (No Change)</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Global Levers */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">Global Levers</CardTitle>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="design-assist-envelope" />
                      <Label htmlFor="design-assist-envelope" className="text-sm cursor-pointer flex items-center gap-1">
                        Design-Assist: Envelope
                        <Info className="h-3 w-3 text-primary" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="design-assist-mep" />
                      <Label htmlFor="design-assist-mep" className="text-sm cursor-pointer flex items-center gap-1">
                        Design-Assist: MEP
                        <Info className="h-3 w-3 text-primary" />
                      </Label>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm flex items-center gap-1">
                          GMP Timing
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </Label>
                      </div>
                      <Select defaultValue="no-change">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-change">No Change</SelectItem>
                          <SelectItem value="early">Early GMP</SelectItem>
                          <SelectItem value="late">Late GMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Long-Lead Packages */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">Long-Lead Packages</CardTitle>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Structural Steel */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">Structural Steel</h3>
                            <Checkbox id="structural-steel" />
                          </div>
                          <Select defaultValue="structure">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="mep">MEP</SelectItem>
                              <SelectItem value="facade">Facade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Switchgear & Electrical Panels */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">Switchgear & Electrical Panels</h3>
                            <Checkbox id="switchgear" />
                          </div>
                          <Select defaultValue="mep">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mep">MEP</SelectItem>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="facade">Facade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-05-01</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-05-01</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Elevators */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">Elevators</h3>
                            <Checkbox id="elevators" />
                          </div>
                          <Select defaultValue="mep">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mep">MEP</SelectItem>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="facade">Facade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Curtain Wall System */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">Curtain Wall System</h3>
                            <Checkbox id="curtain-wall" />
                          </div>
                          <Select defaultValue="envelope">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="envelope">Envelope</SelectItem>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="mep">MEP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-04-30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-04-30</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* HVAC Equipment */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">HVAC Equipment</h3>
                            <Checkbox id="hvac-equipment" />
                          </div>
                          <Select defaultValue="mep">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mep">MEP</SelectItem>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="envelope">Envelope</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Precast Concrete Panels */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">Precast Concrete Panels</h3>
                            <Checkbox id="precast-concrete" />
                          </div>
                          <Select defaultValue="structure">
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="structure">Structure</SelectItem>
                              <SelectItem value="envelope">Envelope</SelectItem>
                              <SelectItem value="mep">MEP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baseline Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scenario Order Date:</span>
                          <span className="font-medium">2024-04-15</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Label className="text-xs font-medium">Order Timing: +0 weeks from baseline</Label>
                        <div className="mt-2">
                          <input 
                            type="range" 
                            className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                            min="-12" 
                            max="12" 
                            defaultValue="0" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Pre-order<br/>-12w</span>
                            <span>Baseline<br/>0</span>
                            <span>Delay<br/>+12w</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Alternate Spec</Label>
                          <Select defaultValue="baseline-spec">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baseline-spec">Baseline Spec</SelectItem>
                              <SelectItem value="alternate-1">Alternate Spec 1</SelectItem>
                              <SelectItem value="alternate-2">Alternate Spec 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Packaging Mode</Label>
                          <Select defaultValue="single">
                            <SelectTrigger className="w-full h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single Contract</SelectItem>
                              <SelectItem value="multiple">Multiple Contracts</SelectItem>
                              <SelectItem value="phased">Phased Procurement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {/* Schedule Overlay */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Schedule Overlay (Baseline vs Scenario)</CardTitle>
                    <p className="text-xs text-muted-foreground">Design Milestones</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Design Milestones */}
                      {[
                        { name: '50% Design Complete', baseline: 90, scenario: 95, date: '2024-02-15' },
                        { name: '60% Design Complete', baseline: 85, scenario: 90, date: '2024-04-01' },
                        { name: '90% Design Complete', baseline: 80, scenario: 88, date: '2024-05-15' },
                        { name: 'IFC Release', baseline: 75, scenario: 85, date: '2024-06-...' }
                      ].map((milestone, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{milestone.name}</span>
                            <span className="text-muted-foreground">{milestone.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-muted rounded relative overflow-hidden">
                                <div 
                                  className="h-full bg-construction-success rounded" 
                                  style={{ width: `${milestone.baseline}%` }}
                                ></div>
                              </div>
                              <div className="h-3 bg-muted rounded relative overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded" 
                                  style={{ width: `${milestone.scenario}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t">
                        <p className="text-xs font-medium mb-2">Long-Lead Procurement Timeline</p>
                        {[
                          { name: 'Structural Steel', baseline: 70, scenario: 75 },
                          { name: 'Switchgear & Elec...', baseline: 68, scenario: 75 },
                          { name: 'Elevators', baseline: 65, scenario: 70 },
                          { name: 'Curtain Wall Syst...', baseline: 62, scenario: 70 },
                          { name: 'HVAC Equipment', baseline: 60, scenario: 68 }
                        ].map((item, i) => (
                          <div key={i} className="space-y-1 mb-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{item.name}</span>
                              <span className="text-muted-foreground">2024-04-15</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-muted rounded relative overflow-hidden">
                                  <div 
                                    className="h-full bg-construction-success rounded" 
                                    style={{ width: `${item.baseline}%` }}
                                  ></div>
                                </div>
                                <div className="h-2 bg-muted rounded relative overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded" 
                                    style={{ width: `${item.scenario}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 pt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-construction-success rounded"></div>
                          <span>Baseline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary rounded"></div>
                          <span>Scenario</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground pt-2">
                        Precon Completion: <span className="text-foreground">Baseline: 2024-12-31</span> • <span className="text-primary font-medium">Scenario: 2024-12-31</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Overlay */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Cost Overlay</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[{ name: 'Baseline', value: 50000 }]}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar dataKey="value" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-1 text-xs">
                        <p className="font-semibold">Cost Breakdown</p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Structure:</span>
                          <span>$11250K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Envelope:</span>
                          <span>$9000K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MEP:</span>
                          <span>$13500K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interiors:</span>
                          <span>$6750K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Site:</span>
                          <span>$4500K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Scenario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[{ name: 'Scenario', value: 50000 }]}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar dataKey="value" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-1 text-xs">
                        <p className="font-semibold">Impact Summary</p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cost Change:</span>
                          <span className="text-destructive">+0.00%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dollar Impact:</span>
                          <span>+$0K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Risk-Adjusted:</span>
                          <span className="text-construction-success">$46.62M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Suggested Strategies */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">AI Suggested Strategies</CardTitle>
                      <Info className="h-4 w-4 text-primary ml-auto" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Strategy 1 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">Early Order Critical Packages</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pre-order structural steel and switchgear 4 weeks early to reduce schedule risk
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs mb-3">
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cost: +0.5%</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Schedule: -2w</Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Risk: -8</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">Apply Strategy</Button>
                    </div>

                    {/* Strategy 2 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">Design-Assist for Envelope & MEP</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enable design-assist for envelope and MEP to accelerate design and reduce procurement timeline
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs mb-3">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Cost: -1%</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Schedule: -2w</Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Risk: -8</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">Apply Strategy</Button>
                    </div>

                    {/* Strategy 3 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">Switch to CMAR Delivery</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Change delivery method to CMAR to engage CM early and reduce procurement timeline
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs mb-3">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Cost: +1%</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Schedule: -2w</Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Risk: -3</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">Apply Strategy</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Design & Procurement Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Design & Procurement Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No design freeze adjustments required</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button variant="default">Set as Active Strategy</Button>
              <Button variant="outline">Save Scenario with Note...</Button>
              <Button variant="outline">Generate Exec One-Pager</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

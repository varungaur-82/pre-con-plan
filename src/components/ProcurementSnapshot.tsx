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
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Settings, Minus, Plus, Info, ExternalLink } from "lucide-react";

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
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="flex-1 m-0 overflow-y-auto">
          <div className="p-6">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-muted-foreground mb-4">5D Scenarios</h2>
              <p className="text-muted-foreground">Content coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

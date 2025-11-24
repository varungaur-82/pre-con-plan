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
import { Settings, Minus, Plus } from "lucide-react";

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
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="flex-1 m-0 overflow-y-auto">
          <div className="p-6">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-muted-foreground mb-4">Strategy & Market</h2>
              <p className="text-muted-foreground">Content coming soon...</p>
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

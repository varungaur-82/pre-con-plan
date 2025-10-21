import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChevronDown, LayoutGrid, Minus, Plus, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACRReport } from "./ACRReport";
import { CommitmentsReport } from "./CommitmentsReport";
import { ChangeLogReport } from "./ChangeLogReport";
import { CashflowReport } from "./CashflowReport";
import { useState } from "react";

const sCurveData = [
  { date: 'Jan 25', approved: 45.8, committed: 5.2, invoiced: 2.1, planned: 4.8 },
  { date: 'Feb 25', approved: 45.8, committed: 8.5, invoiced: 4.3, planned: 8.2 },
  { date: 'Mar 25', approved: 45.8, committed: 12.8, invoiced: 7.2, planned: 12.5 },
  { date: 'Apr 25', approved: 45.8, committed: 18.2, invoiced: 11.5, planned: 17.8 },
  { date: 'May 25', approved: 45.8, committed: 25.6, invoiced: 16.8, planned: 24.2 },
  { date: 'Jun 25', approved: 45.8, committed: 32.4, invoiced: 20.5, planned: 30.5 },
  { date: 'Jul 25', approved: 45.8, committed: 38.7, invoiced: 23.0, planned: 36.8 },
  { date: 'Aug 25', approved: 45.8, committed: 41.9, invoiced: 23.0, planned: 41.2 },
];

const contingencyData = [
  { date: 'Jan 25', remaining: 100 },
  { date: 'Feb 25', remaining: 98 },
  { date: 'Mar 25', remaining: 97 },
  { date: 'Apr 25', remaining: 96 },
  { date: 'May 25', remaining: 95 },
  { date: 'Jun 25', remaining: 95 },
  { date: 'Jul 25', remaining: 94 },
  { date: 'Aug 25', remaining: 94 },
];

const varianceTableData = [
  { level: "L0", package: "FIN - Financing", approvedBudget: 2.0, anticipatedCost: 1.9, varianceDollar: 0.1, variancePercent: 4.86 },
  { level: "L0", package: "COMM - Commissioning", approvedBudget: 0.4, anticipatedCost: 0.4, varianceDollar: 0.0, variancePercent: 6.84 },
  { level: "L0", package: "FF - FF&E", approvedBudget: 0.3, anticipatedCost: 0.3, varianceDollar: 0.0, variancePercent: 2.49 },
];

export function CostTracker() {
  const [paneCount, setPaneCount] = useState(2);
  const [layout, setLayout] = useState("1x2");

  return (
    <Tabs defaultValue="cost-snapshot" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="cost-snapshot">Cost Snapshot</TabsTrigger>
        <TabsTrigger value="acr">ACR</TabsTrigger>
        <TabsTrigger value="commitments">Commitments</TabsTrigger>
        <TabsTrigger value="change-log">Change Log</TabsTrigger>
        <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
        <TabsTrigger value="budget-transfer">Budget Transfer</TabsTrigger>
        <TabsTrigger value="invoice-log">Invoice Log</TabsTrigger>
      </TabsList>

      <TabsContent value="cost-snapshot">
        <div className="container px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Live Cost Tracker</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Export <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Budget</p>
            <p className="text-2xl font-bold">$45.8M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Commitments</p>
            <p className="text-2xl font-bold">$41.9M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Invoiced</p>
            <p className="text-2xl font-bold">$23.0M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Anticipated Cost</p>
            <p className="text-2xl font-bold">$42.6M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Contingency</p>
            <p className="text-2xl font-bold">$2.3M</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Date Range:</span>
            <Select defaultValue="jan">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan">Jan</SelectItem>
                <SelectItem value="feb">Feb</SelectItem>
                <SelectItem value="mar">Mar</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">to</span>
            <Select defaultValue="dec">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dec">Dec</SelectItem>
                <SelectItem value="nov">Nov</SelectItem>
                <SelectItem value="oct">Oct</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">(Jan - Dec)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Panes:</span>
            <Button variant="outline" size="sm" onClick={() => setPaneCount(Math.max(1, paneCount - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-6 text-center">{paneCount}</span>
            <Button variant="outline" size="sm" onClick={() => setPaneCount(Math.min(4, paneCount + 1))}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Layout:</span>
            <Button variant="outline" size="sm">Optimize Width</Button>
            <Button variant="outline" size="sm" onClick={() => setLayout("1x2")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLayout("1x1")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* S-Curve Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">S-Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: '$M', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend iconType="line" wrapperStyle={{ fontSize: '11px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="approved" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3 }}
                    name="Approved Budget"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="committed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Committed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invoiced" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Invoiced"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="planned" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    name="Planned Cashflow"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-blue-700 mb-1">BUDGET REMAINING</p>
                  <p className="text-2xl font-bold text-blue-900">9%</p>
                  <p className="text-xs text-blue-600">$3,934,129</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-green-700 mb-1">INVOICED %</p>
                  <p className="text-2xl font-bold text-green-900">55%</p>
                  <p className="text-xs text-green-600">of committed</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-purple-700 mb-1">PLANNED VS INVOICED</p>
                  <p className="text-2xl font-bold text-purple-900">100%</p>
                  <p className="text-xs text-purple-600">forecast accuracy</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-orange-700 mb-1">TOTAL COMMITTED</p>
                  <p className="text-2xl font-bold text-orange-900">$41.9M</p>
                  <p className="text-xs text-orange-600">current status</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Contingency Drawdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contingency Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contingencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 100]}
                    label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="% Remaining"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-right">
              <p className="text-sm font-medium text-green-600">94% Remaining</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Variance Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Package</TableHead>
                <TableHead className="text-right">Approved Budget</TableHead>
                <TableHead className="text-right">Anticipated Cost</TableHead>
                <TableHead className="text-right">Variance $</TableHead>
                <TableHead className="text-right">Variance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {varianceTableData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {row.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{row.package}</TableCell>
                  <TableCell className="text-right">${row.approvedBudget.toFixed(1)}M</TableCell>
                  <TableCell className="text-right">${row.anticipatedCost.toFixed(1)}M</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    ${row.varianceDollar.toFixed(1)}M
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {row.variancePercent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Commentary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Commentary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Top 3 variance drivers this period:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>FIN - Financing is +4.9% under budget - moderate cost savings</li>
                <li>COMM - Commissioning is +6.84% under budget - moderate cost savings</li>
                <li>FF - FF&E is +2.49% under budget - moderate cost savings</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold">Overall project status:</p>
              <p className="text-muted-foreground">Project is under budget by $3.2M (moderate impact).</p>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </TabsContent>

      <TabsContent value="acr">
        <ACRReport />
      </TabsContent>

      <TabsContent value="commitments">
        <CommitmentsReport />
      </TabsContent>

      <TabsContent value="change-log">
        <ChangeLogReport />
      </TabsContent>

      <TabsContent value="cashflow">
        <CashflowReport />
      </TabsContent>

      <TabsContent value="budget-transfer">
        <div className="container px-6 py-8">
          <p className="text-muted-foreground">Budget Transfer content coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="invoice-log">
        <div className="container px-6 py-8">
          <p className="text-muted-foreground">Invoice Log content coming soon...</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Columns } from "lucide-react";
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
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

const cashflowChartData = [
  { month: 'Jan', actual: 1200000, plan: 1500000, forecast: 1300000, cumActual: 1200000, cumPlan: 1500000 },
  { month: 'Feb', actual: 800000, plan: 1200000, forecast: 1000000, cumActual: 2000000, cumPlan: 2700000 },
  { month: 'Mar', actual: 1500000, plan: 1800000, forecast: 1600000, cumActual: 3500000, cumPlan: 4500000 },
  { month: 'Apr', actual: 2200000, plan: 2500000, forecast: 2300000, cumActual: 5700000, cumPlan: 7000000 },
  { month: 'May', actual: 1800000, plan: 2000000, forecast: 1900000, cumActual: 7500000, cumPlan: 9000000 },
  { month: 'Jun', actual: 2400000, plan: 2800000, forecast: 2500000, cumActual: 9900000, cumPlan: 11800000 },
  { month: 'Jul', actual: 0, plan: 3000000, forecast: 2800000, cumActual: 9900000, cumPlan: 14800000 },
  { month: 'Aug', actual: 0, plan: 2500000, forecast: 2400000, cumActual: 9900000, cumPlan: 17300000 },
  { month: 'Sep', actual: 0, plan: 3200000, forecast: 3000000, cumActual: 9900000, cumPlan: 20500000 },
  { month: 'Oct', actual: 0, plan: 2800000, forecast: 2700000, cumActual: 9900000, cumPlan: 23300000 },
  { month: 'Nov', actual: 0, plan: 1500000, forecast: 1400000, cumActual: 9900000, cumPlan: 24800000 },
  { month: 'Dec', actual: 0, plan: 1200000, forecast: 1100000, cumActual: 9900000, cumPlan: 26000000 },
];

interface VendorCashflow {
  contractNumber: string;
  vendor: string;
  vendorEmail: string;
  code: string;
  codeColor: string;
  totalCommitted: number;
  invoicedToDate: number;
  currentPeriodForecast: number;
  nextPeriodForecast: number;
  cumulativeForecast: number;
  varianceVsBudget: number;
  status: "On Track" | "At Risk" | "Overrun";
  oct2025: number;
  nov2025: number;
  dec2025: number;
  jan2026: number;
}

const cashflowData: VendorCashflow[] = [
  {
    contractNumber: "CON-GC-001",
    vendor: "ABC Construction Group",
    vendorEmail: "abc.construction.group@company.com",
    code: "GC",
    codeColor: "green",
    totalCommitted: 15000000,
    invoicedToDate: 8000000,
    currentPeriodForecast: 1200000,
    nextPeriodForecast: 1500000,
    cumulativeForecast: 14000000,
    varianceVsBudget: 500000,
    status: "On Track",
    oct2025: 568962,
    nov2025: 532635,
    dec2025: 175407,
    jan2026: 310000,
  },
  {
    contractNumber: "CON-SC-002",
    vendor: "Engineering Solutions Inc",
    vendorEmail: "engineering.solutions.inc@company.com",
    code: "SC",
    codeColor: "cyan",
    totalCommitted: 20000000,
    invoicedToDate: 10000000,
    currentPeriodForecast: 1500000,
    nextPeriodForecast: 1900000,
    cumulativeForecast: 17500000,
    varianceVsBudget: -600000,
    status: "At Risk",
    oct2025: 198281,
    nov2025: 356663,
    dec2025: 459273,
    jan2026: 590000,
  },
  {
    contractNumber: "CON-FF-003",
    vendor: "Steel Works LLC",
    vendorEmail: "steel.works.llc@company.com",
    code: "FF",
    codeColor: "purple",
    totalCommitted: 25000000,
    invoicedToDate: 12000000,
    currentPeriodForecast: 1800000,
    nextPeriodForecast: 2300000,
    cumulativeForecast: 21000000,
    varianceVsBudget: -700000,
    status: "Overrun",
    oct2025: 356894,
    nov2025: 241029,
    dec2025: 433046,
    jan2026: 525000,
  },
  {
    contractNumber: "CON-FIN-004",
    vendor: "Electrical Systems Co",
    vendorEmail: "electrical.systems.co@company.com",
    code: "FIN",
    codeColor: "indigo",
    totalCommitted: 30000000,
    invoicedToDate: 14000000,
    currentPeriodForecast: 2100000,
    nextPeriodForecast: 2700000,
    cumulativeForecast: 24500000,
    varianceVsBudget: 800000,
    status: "On Track",
    oct2025: 368440,
    nov2025: 140280,
    dec2025: 279798,
    jan2026: 509000,
  },
];

export function CashflowReport() {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

  const toggleVendor = (contractNumber: string) => {
    const newExpanded = new Set(expandedVendors);
    if (newExpanded.has(contractNumber)) {
      newExpanded.delete(contractNumber);
    } else {
      newExpanded.add(contractNumber);
    }
    setExpandedVendors(newExpanded);
  };

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const formatDetailCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const getCodeColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: "bg-green-100 text-green-700 border-green-200",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    if (status === "On Track") return "bg-green-50 text-green-700 border-green-200";
    if (status === "At Risk") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const totalCommitted = cashflowData.reduce((sum, v) => sum + v.totalCommitted, 0);
  const totalInvoiced = cashflowData.reduce((sum, v) => sum + v.invoicedToDate, 0);
  const totalForecast = cashflowData.reduce((sum, v) => sum + v.cumulativeForecast, 0);
  const totalVariance = cashflowData.reduce((sum, v) => sum + v.varianceVsBudget, 0);

  return (
    <div className="container px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Cashflow Overview</h1>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cash Flow – Plan vs Actual vs Forecast</CardTitle>
            <span className="text-xs text-muted-foreground">Monthly + cumulative S-curves</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashflowChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`}
                />
                <Legend iconType="line" wrapperStyle={{ fontSize: '11px' }} />
                
                {/* Bars */}
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                <Bar dataKey="planned" fill="#e0e7ff" name="Planned" />
                
                {/* Lines */}
                <Line 
                  type="monotone" 
                  dataKey="cumActual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  name="Cum Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumPlan" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Cum Plan"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={false}
                  name="Forecast"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cashflow Overview</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="all-vendors">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-vendors">All Vendors</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-costs">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-costs">All Costs</SelectItem>
              <SelectItem value="hard">Hard Costs</SelectItem>
              <SelectItem value="soft">Soft Costs</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Contract #</TableHead>
                  <TableHead className="min-w-[200px]">Vendor</TableHead>
                  <TableHead className="w-[80px]">Code</TableHead>
                  <TableHead className="text-right">Total Committed</TableHead>
                  <TableHead className="text-right">Invoiced to Date</TableHead>
                  <TableHead className="text-right">Current Period Forecast</TableHead>
                  <TableHead className="text-right">Next Period Forecast</TableHead>
                  <TableHead className="text-right">Cumulative Forecast</TableHead>
                  <TableHead className="text-right">Variance vs Budget</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right">Oct 2025</TableHead>
                  <TableHead className="text-right">Nov 2025</TableHead>
                  <TableHead className="text-right">Dec 2025</TableHead>
                  <TableHead className="text-right">Jan 2026</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashflowData.map((vendor) => {
                  const isExpanded = expandedVendors.has(vendor.contractNumber);

                  return (
                    <>
                      {/* Vendor Header Row */}
                      <TableRow 
                        key={vendor.contractNumber}
                        className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleVendor(vendor.contractNumber)}
                      >
                        <TableCell colSpan={14}>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="font-semibold text-blue-600">
                              {vendor.vendor}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Vendor Detail Row */}
                      {isExpanded && (
                        <TableRow className="hover:bg-muted/30">
                          <TableCell className="pl-8 text-muted-foreground">{vendor.contractNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vendor.vendor}</div>
                              <div className="text-xs text-muted-foreground">{vendor.vendorEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCodeColor(vendor.codeColor)}>
                              {vendor.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(vendor.totalCommitted)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(vendor.invoicedToDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(vendor.currentPeriodForecast)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(vendor.nextPeriodForecast)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(vendor.cumulativeForecast)}
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${vendor.varianceVsBudget >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {vendor.varianceVsBudget >= 0 ? '+' : ''}{formatCurrency(vendor.varianceVsBudget)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(vendor.status)}>
                              {vendor.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{formatDetailCurrency(vendor.oct2025)}</TableCell>
                          <TableCell className="text-right">{formatDetailCurrency(vendor.nov2025)}</TableCell>
                          <TableCell className="text-right">{formatDetailCurrency(vendor.dec2025)}</TableCell>
                          <TableCell className="text-right">{formatDetailCurrency(vendor.jan2026)}</TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}

                {/* Total Row */}
                <TableRow className="bg-muted/50 font-semibold border-t-2">
                  <TableCell colSpan={3}>TOTAL:</TableCell>
                  <TableCell className="text-right">Committed {formatCurrency(totalCommitted)}</TableCell>
                  <TableCell className="text-right">Invoiced {formatCurrency(totalInvoiced)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="text-right">Forecast {formatCurrency(totalForecast)}</TableCell>
                  <TableCell className={`text-right ${totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Variance {totalVariance >= 0 ? '+' : ''}${Math.abs(totalVariance).toLocaleString()}
                  </TableCell>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

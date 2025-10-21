import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Columns, Pencil, Eye } from "lucide-react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

const contingencyData = [
  { category: "Original Contingency", value: 6000000, color: "#fbbf24" },
  { category: "Weather Delays", value: 1500000, color: "#fbbf24" },
  { category: "Steel Escalation", value: 1200000, color: "#fbbf24" },
  { category: "Design Changes", value: 800000, color: "#fbbf24" },
  { category: "Risk Mitigation", value: 600000, color: "#fbbf24" },
  { category: "Remaining", value: 2348595, color: "#fbbf24" },
];

interface Transfer {
  transferId: string;
  date: string;
  fromCostCode: string;
  fromCostCodeName: string;
  amountDebit: number;
  toCostCode: string;
  toCostCodeName: string;
  amountCredit: number;
  netImpact: number;
  type: "Contingency Drawdown" | "Cost Code Transfer";
  reason: string;
  approvedBy: string;
  status: "Approved";
  contingencyBalance: number | null;
  lastModified: string;
  lastModifiedBy: string;
}

interface MonthGroup {
  month: string;
  count: number;
  transfers: Transfer[];
  totalDebits: number;
  totalCredits: number;
  contingencyUsed: number;
}

const transferData: MonthGroup[] = [
  {
    month: "January 2025",
    count: 2,
    totalDebits: 196868,
    totalCredits: 196868,
    contingencyUsed: 146868,
    transfers: [
      {
        transferId: "TR-001",
        date: "15/01/2025",
        fromCostCode: "Z20",
        fromCostCodeName: "Contingency",
        amountDebit: 146868,
        toCostCode: "A10",
        toCostCodeName: "Standard Foundations",
        amountCredit: 146868,
        netImpact: 0,
        type: "Contingency Drawdown",
        reason: "Weather delays and site conditions re...",
        approvedBy: "John Smith",
        status: "Approved",
        contingencyBalance: 2348595,
        lastModified: "15/01/2025",
        lastModifiedBy: "John Smith",
      },
      {
        transferId: "TR-002",
        date: "20/01/2025",
        fromCostCode: "A10",
        fromCostCodeName: "Standard Foundations",
        amountDebit: 50000,
        toCostCode: "A20",
        toCostCodeName: "Special Foundations",
        amountCredit: 50000,
        netImpact: 0,
        type: "Cost Code Transfer",
        reason: "Scope optimization - moving funds fr...",
        approvedBy: "Sarah Johnson",
        status: "Approved",
        contingencyBalance: null,
        lastModified: "20/01/2025",
        lastModifiedBy: "Sarah Johnson",
      },
    ],
  },
  {
    month: "February 2025",
    count: 2,
    totalDebits: 175000,
    totalCredits: 175000,
    contingencyUsed: 100000,
    transfers: [
      {
        transferId: "TR-003",
        date: "01/02/2025",
        fromCostCode: "B10",
        fromCostCodeName: "Superstructure",
        amountDebit: 75000,
        toCostCode: "B20",
        toCostCodeName: "Structural Steel",
        amountCredit: 75000,
        netImpact: 0,
        type: "Cost Code Transfer",
        reason: "Value engineering reallocation betwe...",
        approvedBy: "Mike Chen",
        status: "Approved",
        contingencyBalance: null,
        lastModified: "01/02/2025",
        lastModifiedBy: "Mike Chen",
      },
      {
        transferId: "TR-004",
        date: "10/02/2025",
        fromCostCode: "Z20",
        fromCostCodeName: "Contingency",
        amountDebit: 100000,
        toCostCode: "C10",
        toCostCodeName: "Exterior Enclosure",
        amountCredit: 100000,
        netImpact: 0,
        type: "Contingency Drawdown",
        reason: "Material escalation - steel prices affe...",
        approvedBy: "Lisa Wang",
        status: "Approved",
        contingencyBalance: 2248595,
        lastModified: "10/02/2025",
        lastModifiedBy: "Lisa Wang",
      },
    ],
  },
];

export function BudgetTransferReport() {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(["January 2025"]));

  const toggleMonth = (month: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const totalTransfers = transferData.reduce((sum, g) => sum + g.count, 0);
  const totalDrawdowns = transferData.reduce((sum, g) => 
    sum + g.transfers.filter(t => t.type === "Contingency Drawdown").length, 0
  );
  const totalCodeTransfers = transferData.reduce((sum, g) => 
    sum + g.transfers.filter(t => t.type === "Cost Code Transfer").length, 0
  );

  return (
    <div className="container px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Contingency Balance</h1>

      {/* Contingency Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Contingency & Allowances – Balance & Burn</CardTitle>
            <span className="text-xs text-muted-foreground">With pending exposure</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={contingencyData} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  domain={[-2000000, 6000000]}
                />
                <YAxis 
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={110}
                />
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`}
                />
                <Bar dataKey="value" radius={4}>
                  {contingencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-400 rounded"></div>
              <span className="text-sm text-muted-foreground">Change</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Transfer Log Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Budget Transfer Log</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="drawdown">Contingency Drawdown</SelectItem>
              <SelectItem value="transfer">Cost Code Transfer</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-codes">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-codes">All Cost Codes</SelectItem>
              <SelectItem value="contingency">Contingency</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="month">
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Group by Month</SelectItem>
              <SelectItem value="type">Group by Type</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Transfer
          </Button>
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
                  <TableHead className="w-[100px]">Transfer ID</TableHead>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead className="min-w-[140px]">From Cost Code</TableHead>
                  <TableHead className="text-right w-[120px]">Amount (–)</TableHead>
                  <TableHead className="min-w-[140px]">To Cost Code</TableHead>
                  <TableHead className="text-right w-[120px]">Amount (+)</TableHead>
                  <TableHead className="text-right w-[100px]">Net Impact</TableHead>
                  <TableHead className="w-[160px]">Type</TableHead>
                  <TableHead className="min-w-[200px]">Reason</TableHead>
                  <TableHead className="w-[120px]">Approved By</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="text-right w-[140px]">Contingency Balance</TableHead>
                  <TableHead className="w-[140px]">Last Modified</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferData.map((monthGroup) => {
                  const isExpanded = expandedMonths.has(monthGroup.month);

                  return (
                    <>
                      {/* Month Header Row */}
                      <TableRow 
                        key={monthGroup.month}
                        className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleMonth(monthGroup.month)}
                      >
                        <TableCell colSpan={14}>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="font-semibold text-blue-600">
                              {monthGroup.month}
                            </span>
                            <span className="text-sm text-blue-500">
                              ({monthGroup.count} Adjustments)
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Transfer Detail Rows */}
                      {isExpanded && monthGroup.transfers.map((transfer) => (
                        <TableRow key={transfer.transferId} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{transfer.transferId}</TableCell>
                          <TableCell>{transfer.date}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transfer.fromCostCode}</div>
                              <div className="text-xs text-muted-foreground">{transfer.fromCostCodeName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-red-600 font-medium">
                            –{formatCurrency(transfer.amountDebit)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transfer.toCostCode}</div>
                              <div className="text-xs text-muted-foreground">{transfer.toCostCodeName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            +{formatCurrency(transfer.amountCredit)}
                          </TableCell>
                          <TableCell className="text-right font-medium">${transfer.netImpact}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                transfer.type === "Contingency Drawdown"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {transfer.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{transfer.reason}</TableCell>
                          <TableCell className="text-sm">{transfer.approvedBy}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {transfer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {transfer.contingencyBalance ? formatCurrency(transfer.contingencyBalance) : "–"}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{transfer.lastModified}</div>
                              <div className="text-xs text-muted-foreground">{transfer.lastModifiedBy}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Pencil className="h-4 w-4 text-amber-600" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Subtotal Row */}
                      {isExpanded && (
                        <TableRow className="bg-muted/20 font-medium">
                          <TableCell>Subtotal:</TableCell>
                          <TableCell>{monthGroup.count} transfers</TableCell>
                          <TableCell>Total Debits</TableCell>
                          <TableCell className="text-right text-red-600">
                            –{formatCurrency(monthGroup.totalDebits)}
                          </TableCell>
                          <TableCell>Total Credits</TableCell>
                          <TableCell className="text-right text-green-600">
                            +{formatCurrency(monthGroup.totalCredits)}
                          </TableCell>
                          <TableCell className="text-right">$0 ✓</TableCell>
                          <TableCell colSpan={2}>
                            <div className="text-sm">
                              <div className="text-orange-600">Contingency Used:</div>
                              <div className="text-orange-600 font-semibold">{formatCurrency(monthGroup.contingencyUsed)}</div>
                            </div>
                          </TableCell>
                          <TableCell colSpan={5}>
                            <span className="text-sm">Net Impact</span>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}

                {/* Grand Total Row */}
                <TableRow className="bg-muted/50 font-semibold border-t-2">
                  <TableCell colSpan={14}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <span>TOTALS:</span>
                        <span className="text-green-600">Net Adjustments $0 ✓</span>
                        <span>Contingency Used $246,868</span>
                        <span>Transfers: {totalDrawdowns} drawdowns, {totalCodeTransfers} transfers, 0 scope</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span>Initial Budget $45,798,999</span>
                        <span>Approved Budget $45,798,999 ✓</span>
                        <span>Current Approved Budget $45,798,999</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

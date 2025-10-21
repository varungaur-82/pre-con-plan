import { Card, CardContent } from "@/components/ui/card";
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
import { useState } from "react";

interface ChangeOrder {
  changeOrderNumber: string;
  description: string;
  sourceFunding: string;
  sourceFundingDetail: string;
  amount: number;
  type: "Approved" | "Pending";
  date: string;
  reason: string;
}

interface VendorGroup {
  contractNumber: string;
  vendorName: string;
  changeOrderCount: number;
  changeOrders: ChangeOrder[];
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
}

const changeLogData: VendorGroup[] = [
  {
    contractNumber: "CON-GC-001",
    vendorName: "ABC Construction Group",
    changeOrderCount: 8,
    totalAmount: 2548975,
    approvedAmount: 1603995,
    pendingAmount: 944980,
    changeOrders: [
      {
        changeOrderNumber: "CO-028",
        description: "Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 320799,
        type: "Approved",
        date: "2024-08-23",
        reason: "Additional work",
      },
      {
        changeOrderNumber: "CO-027",
        description: "Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 320799,
        type: "Approved",
        date: "2024-07-14",
        reason: "Schedule acceleration",
      },
      {
        changeOrderNumber: "CO-026",
        description: "Pending Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 314994,
        type: "Pending",
        date: "2024-07-10",
        reason: "Client request",
      },
      {
        changeOrderNumber: "CO-024",
        description: "Pending Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 314993,
        type: "Pending",
        date: "2024-06-05",
        reason: "Unforeseen conditions",
      },
      {
        changeOrderNumber: "CO-022",
        description: "Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 320799,
        type: "Approved",
        date: "2024-06-03",
        reason: "Material upgrade",
      },
      {
        changeOrderNumber: "CO-015",
        description: "Pending Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 314993,
        type: "Pending",
        date: "2024-04-30",
        reason: "Additional scope",
      },
      {
        changeOrderNumber: "CO-011",
        description: "Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 320799,
        type: "Approved",
        date: "2024-04-24",
        reason: "Design modification",
      },
      {
        changeOrderNumber: "CO-004",
        description: "Change Order - Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
        sourceFunding: "GC",
        sourceFundingDetail: "Hard Costs",
        amount: 320799,
        type: "Approved",
        date: "2024-03-14",
        reason: "Scope change",
      },
    ],
  },
  {
    contractNumber: "CON-SC-001",
    vendorName: "Architectural Design Associates",
    changeOrderCount: 2,
    totalAmount: 56746,
    approvedAmount: 38949,
    pendingAmount: 17797,
    changeOrders: [
      {
        changeOrderNumber: "CO-016",
        description: "Pending Change Order - Architecture - Owner Soft Costs",
        sourceFunding: "SC",
        sourceFundingDetail: "Owner Soft Costs",
        amount: 17797,
        type: "Pending",
        date: "2024-04-30",
        reason: "Additional scope",
      },
      {
        changeOrderNumber: "CO-005",
        description: "Change Order - Architecture - Owner Soft Costs",
        sourceFunding: "SC",
        sourceFundingDetail: "Owner Soft Costs",
        amount: 38949,
        type: "Approved",
        date: "2024-03-14",
        reason: "Scope change",
      },
    ],
  },
  {
    contractNumber: "CON-COMM-003",
    vendorName: "Commissioning Specialists",
    changeOrderCount: 2,
    totalAmount: 22089,
    approvedAmount: 12562,
    pendingAmount: 9527,
    changeOrders: [],
  },
  {
    contractNumber: "CON-SC-002",
    vendorName: "Engineering Solutions Inc.",
    changeOrderCount: 2,
    totalAmount: 47288,
    approvedAmount: 32457,
    pendingAmount: 14831,
    changeOrders: [],
  },
  {
    contractNumber: "CON-FIN-002",
    vendorName: "Financial Services Group",
    changeOrderCount: 6,
    totalAmount: 166027,
    approvedAmount: 106022,
    pendingAmount: 60005,
    changeOrders: [],
  },
  {
    contractNumber: "CON-FF-001",
    vendorName: "Furniture & Fixtures Co.",
    changeOrderCount: 2,
    totalAmount: 28241,
    approvedAmount: 20165,
    pendingAmount: 8076,
    changeOrders: [],
  },
  {
    contractNumber: "CON-SC-004",
    vendorName: "Landscape Design Studio",
    changeOrderCount: 2,
    totalAmount: 28372,
    approvedAmount: 19474,
    pendingAmount: 8898,
    changeOrders: [],
  },
  {
    contractNumber: "CON-SC-003",
    vendorName: "MEP Consulting Group",
    changeOrderCount: 2,
    totalAmount: 37830,
    approvedAmount: 25966,
    pendingAmount: 11864,
    changeOrders: [],
  },
];

export function ChangeLogReport() {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set(["CON-GC-001", "CON-SC-001"]));

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
    return `$${value.toLocaleString()}`;
  };

  const totalChangeOrders = changeLogData.reduce((sum, v) => sum + v.changeOrderCount, 0);

  return (
    <div className="container px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Change Order Log</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{totalChangeOrders} Change Orders</span>
          <Select defaultValue="all-vendors">
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-vendors">All Vendors</SelectItem>
              <SelectItem value="commissioning">Commissioning Specialists</SelectItem>
              <SelectItem value="furniture">Furniture & Fixtures Co.</SelectItem>
              <SelectItem value="financial">Financial Services Group</SelectItem>
              <SelectItem value="abc">ABC Construction Group</SelectItem>
              <SelectItem value="architectural">Architectural Design Associates</SelectItem>
              <SelectItem value="engineering">Engineering Solutions Inc.</SelectItem>
              <SelectItem value="mep">MEP Consulting Group</SelectItem>
              <SelectItem value="landscape">Landscape Design Studio</SelectItem>
              <SelectItem value="pm">Project Management Partners</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead className="w-[140px]">Contract #</TableHead>
                  <TableHead className="w-[140px]">Change Order #</TableHead>
                  <TableHead className="min-w-[280px]">Description</TableHead>
                  <TableHead className="min-w-[140px]">Source Funding</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                  <TableHead className="w-[140px]">Type</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[160px]">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeLogData.map((vendor) => {
                  const isExpanded = expandedVendors.has(vendor.contractNumber);
                  const hasDetails = vendor.changeOrders.length > 0;

                  return (
                    <>
                      {/* Vendor Header Row */}
                      <TableRow 
                        key={vendor.contractNumber}
                        className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                        onClick={() => hasDetails && toggleVendor(vendor.contractNumber)}
                      >
                        <TableCell colSpan={5}>
                          <div className="flex items-center gap-2">
                            {hasDetails && (
                              <>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-blue-600" />
                                )}
                              </>
                            )}
                            <span className="font-semibold text-blue-600">
                              {vendor.vendorName}
                            </span>
                            <span className="text-sm text-blue-500">
                              ({vendor.changeOrderCount} change orders)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell colSpan={3} className="text-right">
                          <div className="flex items-center justify-end gap-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground mr-2">Total Amount</span>
                              <span className="font-semibold text-lg">{formatCurrency(vendor.totalAmount)}</span>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="text-green-600">
                                Approved: {formatCurrency(vendor.approvedAmount)}
                              </div>
                              <div className="text-orange-600">
                                Pending: {formatCurrency(vendor.pendingAmount)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Change Order Detail Rows */}
                      {hasDetails && isExpanded && vendor.changeOrders.map((co) => (
                        <TableRow key={`${vendor.contractNumber}-${co.changeOrderNumber}`} className="hover:bg-muted/30">
                          <TableCell className="pl-8 text-muted-foreground">{vendor.contractNumber}</TableCell>
                          <TableCell className="font-medium">{co.changeOrderNumber}</TableCell>
                          <TableCell className="text-sm">{co.description}</TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">
                                {co.sourceFunding}
                              </Badge>
                              <div className="text-xs text-muted-foreground">{co.sourceFundingDetail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(co.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                co.type === "Approved" 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {co.type} <ChevronDown className="ml-1 h-3 w-3" />
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{co.date}</TableCell>
                          <TableCell className="text-sm">{co.reason}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

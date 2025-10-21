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

interface Invoice {
  contractNumber: string;
  invoiceNumber: string;
  workDescription: string;
  code: string;
  codeColor: string;
  periodCovered: string;
  amountRequested: number;
  approvedAmount: number;
  netPayable: number;
  paymentStatus: "Paid" | "In Review" | "Draft";
  complianceStatus: "Pass" | "Pending" | "Fail";
  contractValue: number;
  invoiced: number;
  balance: number;
  lastModified: string;
  lastModifiedBy: string;
}

interface VendorGroup {
  vendorName: string;
  invoiceCount: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  paidAmount: number;
  invoices: Invoice[];
}

const invoiceData: VendorGroup[] = [
  {
    vendorName: "ABC Construction Group",
    invoiceCount: 4,
    totalAmount: 35677242,
    approvedAmount: 0,
    pendingAmount: 25825540,
    paidAmount: 9851702,
    invoices: [
      {
        contractNumber: "CON-GC-001",
        invoiceNumber: "INV-013",
        workDescription: "HVAC Installation",
        code: "GC",
        codeColor: "green",
        periodCovered: "Oct 2025",
        amountRequested: 9863182,
        approvedAmount: 9851702,
        netPayable: 9240896,
        paymentStatus: "Paid",
        complianceStatus: "Pass",
        contractValue: 36317389,
        invoiced: 9851702,
        balance: 26465687,
        lastModified: "2025-10-21",
        lastModifiedBy: "Vendor",
      },
      {
        contractNumber: "CON-GC-001",
        invoiceNumber: "INV-014",
        workDescription: "Electrical Installation",
        code: "GC",
        codeColor: "green",
        periodCovered: "Sep 2025",
        amountRequested: 8795325,
        approvedAmount: 8771553,
        netPayable: 7964570,
        paymentStatus: "In Review",
        complianceStatus: "Pending",
        contractValue: 36317389,
        invoiced: 9851702,
        balance: 26465687,
        lastModified: "2025-09-30",
        lastModifiedBy: "Project Manager",
      },
      {
        contractNumber: "CON-GC-001",
        invoiceNumber: "INV-015",
        workDescription: "Subcontractor Services",
        code: "GC",
        codeColor: "green",
        periodCovered: "Aug 2025",
        amountRequested: 8639674,
        approvedAmount: 8555443,
        netPayable: 7973673,
        paymentStatus: "In Review",
        complianceStatus: "Pass",
        contractValue: 36317389,
        invoiced: 9851702,
        balance: 26465687,
        lastModified: "2025-10-12",
        lastModifiedBy: "Vendor",
      },
      {
        contractNumber: "CON-GC-001",
        invoiceNumber: "INV-016",
        workDescription: "Subcontractor Services",
        code: "GC",
        codeColor: "green",
        periodCovered: "Jul 2025",
        amountRequested: 8657909,
        approvedAmount: 8498544,
        netPayable: 7852655,
        paymentStatus: "Draft",
        complianceStatus: "Fail",
        contractValue: 36317389,
        invoiced: 9851702,
        balance: 26465687,
        lastModified: "2025-09-22",
        lastModifiedBy: "Project Manager",
      },
    ],
  },
  {
    vendorName: "Architectural Design Associates",
    invoiceCount: 4,
    totalAmount: 897544,
    approvedAmount: 0,
    pendingAmount: 649702,
    paidAmount: 247842,
    invoices: [
      {
        contractNumber: "CON-SC-001",
        invoiceNumber: "INV-017",
        workDescription: "HVAC Installation",
        code: "SC",
        codeColor: "cyan",
        periodCovered: "Oct 2025",
        amountRequested: 248131,
        approvedAmount: 247842,
        netPayable: 232476,
        paymentStatus: "Paid",
        complianceStatus: "Pass",
        contractValue: 913649,
        invoiced: 247842,
        balance: 665807,
        lastModified: "2025-10-21",
        lastModifiedBy: "Vendor",
      },
      {
        contractNumber: "CON-SC-001",
        invoiceNumber: "INV-018",
        workDescription: "Electrical Installation",
        code: "SC",
        codeColor: "cyan",
        periodCovered: "Sep 2025",
        amountRequested: 221267,
        approvedAmount: 220669,
        netPayable: 200368,
        paymentStatus: "In Review",
        complianceStatus: "Pending",
        contractValue: 913649,
        invoiced: 247842,
        balance: 665807,
        lastModified: "2025-09-30",
        lastModifiedBy: "Project Manager",
      },
      {
        contractNumber: "CON-SC-001",
        invoiceNumber: "INV-019",
        workDescription: "Subcontractor Services",
        code: "SC",
        codeColor: "cyan",
        periodCovered: "Aug 2025",
        amountRequested: 217351,
        approvedAmount: 215232,
        netPayable: 200596,
        paymentStatus: "In Review",
        complianceStatus: "Pass",
        contractValue: 913649,
        invoiced: 247842,
        balance: 665807,
        lastModified: "2025-10-12",
        lastModifiedBy: "Vendor",
      },
      {
        contractNumber: "CON-SC-001",
        invoiceNumber: "INV-020",
        workDescription: "Subcontractor Services",
        code: "SC",
        codeColor: "cyan",
        periodCovered: "Jul 2025",
        amountRequested: 217810,
        approvedAmount: 213801,
        netPayable: 197552,
        paymentStatus: "Draft",
        complianceStatus: "Fail",
        contractValue: 913649,
        invoiced: 247842,
        balance: 665807,
        lastModified: "2025-09-22",
        lastModifiedBy: "Project Manager",
      },
    ],
  },
  {
    vendorName: "Commissioning Specialists",
    invoiceCount: 4,
    totalAmount: 356047,
    approvedAmount: 0,
    pendingAmount: 257731,
    paidAmount: 98316,
    invoices: [],
  },
  {
    vendorName: "Engineering Solutions Inc.",
    invoiceCount: 4,
    totalAmount: 747953,
    approvedAmount: 0,
    pendingAmount: 541418,
    paidAmount: 206535,
    invoices: [],
  },
  {
    vendorName: "Financial Services Group",
    invoiceCount: 4,
    totalAmount: 1806970,
    approvedAmount: 0,
    pendingAmount: 1308004,
    paidAmount: 498966,
    invoices: [],
  },
  {
    vendorName: "Furniture & Fixtures Co.",
    invoiceCount: 4,
    totalAmount: 294865,
    approvedAmount: 0,
    pendingAmount: 213443,
    paidAmount: 81422,
    invoices: [],
  },
  {
    vendorName: "Landscape Design Studio",
    invoiceCount: 4,
    totalAmount: 448772,
    approvedAmount: 0,
    pendingAmount: 324850,
    paidAmount: 123922,
    invoices: [],
  },
  {
    vendorName: "MEP Consulting Group",
    invoiceCount: 4,
    totalAmount: 598362,
    approvedAmount: 0,
    pendingAmount: 433134,
    paidAmount: 165228,
    invoices: [],
  },
];

export function InvoiceLogReport() {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(
    new Set(["ABC Construction Group", "Architectural Design Associates"])
  );

  const toggleVendor = (vendorName: string) => {
    const newExpanded = new Set(expandedVendors);
    if (newExpanded.has(vendorName)) {
      newExpanded.delete(vendorName);
    } else {
      newExpanded.add(vendorName);
    }
    setExpandedVendors(newExpanded);
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const getCodeColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: "bg-green-100 text-green-700 border-green-200",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === "Paid") return "bg-green-50 text-green-700 border-green-200";
    if (status === "In Review") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getComplianceStatusColor = (status: string) => {
    if (status === "Pass") return "bg-green-50 text-green-700 border-green-200";
    if (status === "Pending") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const totalInvoices = invoiceData.reduce((sum, v) => sum + v.invoiceCount, 0);

  return (
    <div className="container px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice Log</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{totalInvoices} Invoices</span>
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
          <Select defaultValue="all-payment">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-payment">All Payment Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-compliance">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-compliance">All Compliance Status</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
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
                  <TableHead className="w-[120px]">Contract #</TableHead>
                  <TableHead className="w-[100px]">Invoice #</TableHead>
                  <TableHead className="min-w-[180px]">Work Description</TableHead>
                  <TableHead className="w-[80px]">Code</TableHead>
                  <TableHead className="w-[120px]">Period Covered</TableHead>
                  <TableHead className="text-right w-[140px]">Amount Requested</TableHead>
                  <TableHead className="text-right w-[140px]">Approved Amount</TableHead>
                  <TableHead className="text-right w-[120px]">Net Payable</TableHead>
                  <TableHead className="w-[120px]">Payment Status</TableHead>
                  <TableHead className="w-[140px]">Compliance Status</TableHead>
                  <TableHead className="text-right w-[140px]">Contract Value</TableHead>
                  <TableHead className="text-right w-[120px]">Invoiced</TableHead>
                  <TableHead className="text-right w-[120px]">Balance</TableHead>
                  <TableHead className="w-[140px]">Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((vendor) => {
                  const isExpanded = expandedVendors.has(vendor.vendorName);
                  const hasInvoices = vendor.invoices.length > 0;

                  return (
                    <>
                      {/* Vendor Header Row */}
                      <TableRow
                        key={vendor.vendorName}
                        className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
                        onClick={() => hasInvoices && toggleVendor(vendor.vendorName)}
                      >
                        <TableCell colSpan={14}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {hasInvoices ? (
                                isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-blue-600" />
                                )
                              ) : (
                                <ChevronRight className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="font-semibold text-blue-600">
                                {vendor.vendorName}
                              </span>
                              <span className="text-sm text-blue-500">
                                ({vendor.invoiceCount} invoices)
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
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
                                <div className="text-blue-600">
                                  Paid: {formatCurrency(vendor.paidAmount)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Invoice Detail Rows */}
                      {hasInvoices &&
                        isExpanded &&
                        vendor.invoices.map((invoice) => (
                          <TableRow
                            key={invoice.invoiceNumber}
                            className="hover:bg-muted/30"
                          >
                            <TableCell className="pl-8 text-muted-foreground">
                              {invoice.contractNumber}
                            </TableCell>
                            <TableCell>
                              <span className="text-blue-600 font-medium">
                                {invoice.invoiceNumber}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {invoice.workDescription}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getCodeColor(invoice.codeColor)}
                              >
                                {invoice.code}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {invoice.periodCovered}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(invoice.amountRequested)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(invoice.approvedAmount)}
                            </TableCell>
                            <TableCell className="text-right text-green-600 font-semibold">
                              {formatCurrency(invoice.netPayable)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getPaymentStatusColor(invoice.paymentStatus)}
                              >
                                {invoice.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getComplianceStatusColor(
                                  invoice.complianceStatus
                                )}
                              >
                                {invoice.complianceStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(invoice.contractValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(invoice.invoiced)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(invoice.balance)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{invoice.lastModified}</div>
                                <div className="text-xs text-muted-foreground">
                                  {invoice.lastModifiedBy}
                                </div>
                              </div>
                            </TableCell>
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

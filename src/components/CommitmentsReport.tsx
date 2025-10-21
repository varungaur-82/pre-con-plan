import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Contract {
  contractNumber: string;
  vendor: string;
  vendorEmail: string;
  workDescription: string;
  dateRange: string;
  code: string;
  codeColor: string;
  originalValue: number;
  changeOrdersApproved: number;
  changeOrdersPending: number;
  totalCommitted: number;
  invoiced: number;
  balance: number;
  status: string;
  contactName: string;
  contactPhone: string;
}

const contractsData: Contract[] = [
  {
    contractNumber: "CON-COMM-003",
    vendor: "Commissioning Specialists",
    vendorEmail: "rachel@commissioning.com",
    workDescription: "Commissioning - COMM Package",
    dateRange: "2024-02-29 - 2024-11-30",
    code: "COMM",
    codeColor: "blue",
    originalValue: 349874,
    changeOrdersApproved: 12562,
    changeOrdersPending: 9527,
    totalCommitted: 362436,
    invoiced: 202773,
    balance: 159663,
    status: "Active",
    contactName: "Rachel Green",
    contactPhone: "(555) 678-9012",
  },
  {
    contractNumber: "CON-FF-001",
    vendor: "Furniture & Fixtures Co.",
    vendorEmail: "amanda@ffco.com",
    workDescription: "FF&E - FF Package",
    dateRange: "2023-12-31 - 2024-12-30",
    code: "FF",
    codeColor: "purple",
    originalValue: 279990,
    changeOrdersApproved: 20165,
    changeOrdersPending: 8076,
    totalCommitted: 300155,
    invoiced: 178607,
    balance: 121548,
    status: "Active",
    contactName: "Amanda White",
    contactPhone: "(555) 456-7890",
  },
  {
    contractNumber: "CON-FIN-002",
    vendor: "Financial Services Group",
    vendorEmail: "daniel@financeservices.com",
    workDescription: "Financing - FIN Package",
    dateRange: "2024-01-01 - 2024-12-15",
    code: "FIN",
    codeColor: "indigo",
    originalValue: 1733369,
    changeOrdersApproved: 106022,
    changeOrdersPending: 50049,
    totalCommitted: 1839391,
    invoiced: 1373955,
    balance: 465436,
    status: "Active",
    contactName: "Daniel Kim",
    contactPhone: "(555) 567-8901",
  },
  {
    contractNumber: "CON-GC-001",
    vendor: "ABC Construction Group",
    vendorEmail: "john.smith@abcconstruction.com",
    workDescription: "Hard Costs - All Packages (A, B, C, D, E, F, G, IT, AV, SEC, Z)",
    dateRange: "2024-01-01 - 2024-11-30",
    code: "GC",
    codeColor: "green",
    originalValue: 34713394,
    changeOrdersApproved: 1603995,
    changeOrdersPending: 944980,
    totalCommitted: 36317389,
    invoiced: 19621670,
    balance: 16695719,
    status: "Active",
    contactName: "John Smith",
    contactPhone: "(555) 123-4567",
  },
  {
    contractNumber: "CON-SC-001",
    vendor: "Architectural Design Associates",
    vendorEmail: "sarah@archdesign.com",
    workDescription: "Architecture - Owner Soft Costs",
    dateRange: "2023-12-31 - 2024-12-30",
    code: "SC",
    codeColor: "cyan",
    originalValue: 913649,
    changeOrdersApproved: 38949,
    changeOrdersPending: 17797,
    totalCommitted: 913649,
    invoiced: 182729,
    balance: 730920,
    status: "Active",
    contactName: "Sarah Johnson",
    contactPhone: "(555) 111-2222",
  },
  {
    contractNumber: "CON-SC-002",
    vendor: "Engineering Solutions Inc.",
    vendorEmail: "michael@engsolutions.com",
    workDescription: "Structural Engineering - Owner Soft Costs",
    dateRange: "2024-01-15 - 2024-12-20",
    code: "SC",
    codeColor: "cyan",
    originalValue: 761374,
    changeOrdersApproved: 32457,
    changeOrdersPending: 14831,
    totalCommitted: 761374,
    invoiced: 266480,
    balance: 494894,
    status: "Active",
    contactName: "Michael Chen",
    contactPhone: "(555) 222-3333",
  },
  {
    contractNumber: "CON-SC-003",
    vendor: "MEP Consulting Group",
    vendorEmail: "lisa@mepconsulting.com",
    workDescription: "MEP Engineering - Owner Soft Costs",
    dateRange: "2024-01-31 - 2024-12-10",
    code: "SC",
    codeColor: "cyan",
    originalValue: 609099,
    changeOrdersApproved: 25966,
    changeOrdersPending: 11864,
    totalCommitted: 609099,
    invoiced: 304549,
    balance: 304550,
    status: "Active",
    contactName: "Lisa Rodriguez",
    contactPhone: "(555) 333-4444",
  },
  {
    contractNumber: "CON-SC-004",
    vendor: "Landscape Design Studio",
    vendorEmail: "david@landscapedesign.com",
    workDescription: "Landscape Architecture - Owner Soft Costs",
    dateRange: "2024-02-14 - 2024-11-30",
    code: "SC",
    codeColor: "cyan",
    originalValue: 456824,
    changeOrdersApproved: 19474,
    changeOrdersPending: 8898,
    totalCommitted: 456824,
    invoiced: 296935,
    balance: 159889,
    status: "Active",
    contactName: "David Kim",
    contactPhone: "(555) 444-5555",
  },
  {
    contractNumber: "CON-SC-005",
    vendor: "Project Management Partners",
    vendorEmail: "jennifer@pmpartners.com",
    workDescription: "Project Management - Owner Soft Costs",
    dateRange: "2024-02-29 - 2024-11-20",
    code: "SC",
    codeColor: "cyan",
    originalValue: 304549,
    changeOrdersApproved: 12983,
    changeOrdersPending: 5932,
    totalCommitted: 304549,
    invoiced: 243639,
    balance: 60910,
    status: "Active",
    contactName: "Jennifer Lee",
    contactPhone: "(555) 555-6666",
  },
];

export function CommitmentsReport() {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const getCodeColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
      green: "bg-green-100 text-green-700 border-green-200",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalCommitted = contractsData.reduce((sum, c) => sum + c.totalCommitted, 0);
  const totalInvoiced = contractsData.reduce((sum, c) => sum + c.invoiced, 0);
  const totalBalance = contractsData.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="container px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendor Commitments & Contracts</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">9 Active Contracts</span>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead className="min-w-[220px]">Vendor</TableHead>
                  <TableHead className="min-w-[280px]">Work Description</TableHead>
                  <TableHead className="w-[80px]">Code</TableHead>
                  <TableHead className="text-right">Original Value</TableHead>
                  <TableHead className="text-right min-w-[150px]">Change Orders</TableHead>
                  <TableHead className="text-right">Total Committed</TableHead>
                  <TableHead className="text-right">Invoiced</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[160px]">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractsData.map((contract) => (
                  <TableRow key={contract.contractNumber} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.vendor}</div>
                        <div className="text-xs text-muted-foreground">{contract.vendorEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{contract.workDescription}</div>
                        <div className="text-xs text-muted-foreground">{contract.dateRange}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCodeColor(contract.codeColor)}>
                        {contract.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(contract.originalValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">
                        <div className="text-muted-foreground">
                          Approved: <span className="font-medium text-foreground">{formatCurrency(contract.changeOrdersApproved)}</span>
                        </div>
                        <div className="text-orange-600">
                          Pending: {formatCurrency(contract.changeOrdersPending)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(contract.totalCommitted)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(contract.invoiced)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(contract.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{contract.contactName}</div>
                        <div className="text-xs text-muted-foreground">{contract.contactPhone}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Total Row */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={6}>Total Commitments</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalCommitted)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalInvoiced)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalBalance)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

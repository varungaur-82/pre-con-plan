import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface CostRow {
  code: string;
  description: string;
  approvedBudget: number;
  contractValue: number;
  approvedCORs: number;
  pendingCORs: number;
  committedCosts: number;
  anticipatedCosts: number;
  invoicedToDate: number;
  balanceContractValue: number;
  variance: number;
  level: number;
  children?: CostRow[];
}

const costData: CostRow[] = [
  {
    code: "GC",
    description: "Hard Costs",
    approvedBudget: 37633844,
    contractValue: 34713394,
    approvedCORs: 1603995,
    pendingCORs: 944980,
    committedCosts: 36317389,
    anticipatedCosts: 36963394,
    invoicedToDate: 19621670,
    balanceContractValue: 16695719,
    variance: 670450,
    level: 0,
    children: [
      {
        code: "A",
        description: "Substructure",
        approvedBudget: 2124138,
        contractValue: 1999706,
        approvedCORs: 91158,
        pendingCORs: 62148,
        committedCosts: 2090864,
        anticipatedCosts: 2083790,
        invoicedToDate: 1021769,
        balanceContractValue: 1069095,
        variance: 40348,
        level: 1,
        children: [
          {
            code: "A18",
            description: "Standard Foundations",
            approvedBudget: 205650,
            contractValue: 190445,
            approvedCORs: 14578,
            pendingCORs: 5847,
            committedCosts: 205023,
            anticipatedCosts: 205650,
            invoicedToDate: 124682,
            balanceContractValue: 80341,
            variance: 0,
            level: 2,
          },
          {
            code: "A28",
            description: "Special Foundations",
            approvedBudget: 300000,
            contractValue: 260573,
            approvedCORs: 16916,
            pendingCORs: 10338,
            committedCosts: 277489,
            anticipatedCosts: 287827,
            invoicedToDate: 189859,
            balanceContractValue: 87630,
            variance: 12173,
            level: 2,
          },
          {
            code: "A38",
            description: "Slab on Grade",
            approvedBudget: 132750,
            contractValue: 128513,
            approvedCORs: 3029,
            pendingCORs: 2606,
            committedCosts: 131542,
            anticipatedCosts: 132750,
            invoicedToDate: 103766,
            balanceContractValue: 33776,
            variance: 0,
            level: 2,
          },
        ],
      },
      {
        code: "B",
        description: "Shell",
        approvedBudget: 11076196,
        contractValue: 10379052,
        approvedCORs: 302436,
        pendingCORs: 262891,
        committedCosts: 10681488,
        anticipatedCosts: 10873335,
        invoicedToDate: 5429141,
        balanceContractValue: 5252347,
        variance: 202861,
        level: 1,
      },
      {
        code: "C",
        description: "Interiors",
        approvedBudget: 4275675,
        contractValue: 3863686,
        approvedCORs: 216790,
        pendingCORs: 118895,
        committedCosts: 4080476,
        anticipatedCosts: 4187812,
        invoicedToDate: 2371779,
        balanceContractValue: 1708697,
        variance: 87863,
        level: 1,
      },
      {
        code: "D",
        description: "Services (MEP)",
        approvedBudget: 7194012,
        contractValue: 6540939,
        approvedCORs: 363279,
        pendingCORs: 179350,
        committedCosts: 6904218,
        anticipatedCosts: 7068508,
        invoicedToDate: 3908400,
        balanceContractValue: 2995818,
        variance: 125504,
        level: 1,
      },
      {
        code: "E",
        description: "Equipment & Furnishings",
        approvedBudget: 1350877,
        contractValue: 1227540,
        approvedCORs: 68703,
        pendingCORs: 41205,
        committedCosts: 1296243,
        anticipatedCosts: 1329625,
        invoicedToDate: 803787,
        balanceContractValue: 492456,
        variance: 21252,
        level: 1,
      },
      {
        code: "F",
        description: "Special Construction & Demolition",
        approvedBudget: 4366060,
        contractValue: 4057772,
        approvedCORs: 213515,
        pendingCORs: 110306,
        committedCosts: 4271287,
        anticipatedCosts: 4316784,
        invoicedToDate: 2317726,
        balanceContractValue: 1953561,
        variance: 49276,
        level: 1,
      },
      {
        code: "G",
        description: "Sitework",
        approvedBudget: 4067333,
        contractValue: 3672873,
        approvedCORs: 197342,
        pendingCORs: 105137,
        committedCosts: 3870215,
        anticipatedCosts: 3960292,
        invoicedToDate: 2299316,
        balanceContractValue: 1570899,
        variance: 107041,
        level: 1,
      },
      {
        code: "IT",
        description: "IT",
        approvedBudget: 166364,
        contractValue: 161244,
        approvedCORs: 4778,
        pendingCORs: 4577,
        committedCosts: 166022,
        anticipatedCosts: 166364,
        invoicedToDate: 98254,
        balanceContractValue: 67768,
        variance: 0,
        level: 1,
      },
      {
        code: "AV",
        description: "AV",
        approvedBudget: 83848,
        contractValue: 81971,
        approvedCORs: 5404,
        pendingCORs: 1611,
        committedCosts: 87375,
        anticipatedCosts: 83848,
        invoicedToDate: 47501,
        balanceContractValue: 39874,
        variance: 0,
        level: 1,
      },
      {
        code: "SEC",
        description: "Security",
        approvedBudget: 75862,
        contractValue: 71522,
        approvedCORs: 3825,
        pendingCORs: 2018,
        committedCosts: 75347,
        anticipatedCosts: 75862,
        invoicedToDate: 32433,
        balanceContractValue: 42914,
        variance: 0,
        level: 1,
      },
      {
        code: "Z",
        description: "General Requirements",
        approvedBudget: 2853479,
        contractValue: 2657089,
        approvedCORs: 136765,
        pendingCORs: 58842,
        committedCosts: 2793854,
        anticipatedCosts: 2817174,
        invoicedToDate: 1291564,
        balanceContractValue: 1502290,
        variance: 36305,
        level: 1,
      },
    ],
  },
  {
    code: "SC",
    description: "Owner Soft Costs",
    approvedBudget: 3104824,
    contractValue: 2915668,
    approvedCORs: 129831,
    pendingCORs: 59325,
    committedCosts: 3045499,
    anticipatedCosts: 3104824,
    invoicedToDate: 1625009,
    balanceContractValue: 1420490,
    variance: 0,
    level: 0,
    children: [
      {
        code: "SC18",
        description: "Architect",
        approvedBudget: 825000,
        contractValue: 780000,
        approvedCORs: 35000,
        pendingCORs: 18000,
        committedCosts: 815000,
        anticipatedCosts: 825000,
        invoicedToDate: 520000,
        balanceContractValue: 295000,
        variance: 0,
        level: 1,
      },
      {
        code: "SC28",
        description: "PM/CM",
        approvedBudget: 1650000,
        contractValue: 1560000,
        approvedCORs: 72000,
        pendingCORs: 30000,
        committedCosts: 1632000,
        anticipatedCosts: 1650000,
        invoicedToDate: 892000,
        balanceContractValue: 740000,
        variance: 0,
        level: 1,
      },
      {
        code: "SC38",
        description: "Permits",
        approvedBudget: 412500,
        contractValue: 392500,
        approvedCORs: 15000,
        pendingCORs: 8000,
        committedCosts: 407500,
        anticipatedCosts: 412500,
        invoicedToDate: 165000,
        balanceContractValue: 242500,
        variance: 0,
        level: 1,
      },
      {
        code: "SC48",
        description: "Legal",
        approvedBudget: 217324,
        contractValue: 183168,
        approvedCORs: 7831,
        pendingCORs: 3325,
        committedCosts: 190999,
        anticipatedCosts: 217324,
        invoicedToDate: 48009,
        balanceContractValue: 142990,
        variance: 0,
        level: 1,
      },
    ],
  },
  {
    code: "FF",
    description: "FF&E",
    approvedBudget: 316092,
    contractValue: 279990,
    approvedCORs: 20165,
    pendingCORs: 8076,
    committedCosts: 300155,
    anticipatedCosts: 308231,
    invoicedToDate: 178607,
    balanceContractValue: 121548,
    variance: 7861,
    level: 0,
    children: [
      {
        code: "FF18",
        description: "Furniture",
        approvedBudget: 316092,
        contractValue: 279990,
        approvedCORs: 20165,
        pendingCORs: 8076,
        committedCosts: 300155,
        anticipatedCosts: 308231,
        invoicedToDate: 178607,
        balanceContractValue: 121548,
        variance: 7861,
        level: 1,
      },
    ],
  },
  {
    code: "FIN",
    description: "Financing",
    approvedBudget: 1996370,
    contractValue: 1733369,
    approvedCORs: 106022,
    pendingCORs: 60005,
    committedCosts: 1839391,
    anticipatedCosts: 1899396,
    invoicedToDate: 1373955,
    balanceContractValue: 465436,
    variance: 96974,
    level: 0,
    children: [
      {
        code: "FIN18",
        description: "Lender",
        approvedBudget: 1996370,
        contractValue: 1733369,
        approvedCORs: 106022,
        pendingCORs: 60005,
        committedCosts: 1839391,
        anticipatedCosts: 1899396,
        invoicedToDate: 1373955,
        balanceContractValue: 465436,
        variance: 96974,
        level: 1,
      },
    ],
  },
  {
    code: "COMM",
    description: "Commissioning",
    approvedBudget: 399274,
    contractValue: 349874,
    approvedCORs: 12562,
    pendingCORs: 9527,
    committedCosts: 362436,
    anticipatedCosts: 371963,
    invoicedToDate: 202773,
    balanceContractValue: 159663,
    variance: 27311,
    level: 0,
    children: [
      {
        code: "COMM18",
        description: "Cx Agent",
        approvedBudget: 399274,
        contractValue: 349874,
        approvedCORs: 12562,
        pendingCORs: 9527,
        committedCosts: 362436,
        anticipatedCosts: 371963,
        invoicedToDate: 202773,
        balanceContractValue: 159663,
        variance: 27311,
        level: 1,
      },
    ],
  },
  {
    code: "CONT",
    description: "Contingency",
    approvedBudget: 2348595,
    contractValue: 0,
    approvedCORs: 0,
    pendingCORs: 0,
    committedCosts: 0,
    anticipatedCosts: 0,
    invoicedToDate: 0,
    balanceContractValue: 0,
    variance: 2348595,
    level: 0,
    children: [
      {
        code: "CONT18",
        description: "Owner",
        approvedBudget: 2348595,
        contractValue: 0,
        approvedCORs: 0,
        pendingCORs: 0,
        committedCosts: 0,
        anticipatedCosts: 0,
        invoicedToDate: 0,
        balanceContractValue: 0,
        variance: 2348595,
        level: 1,
      },
    ],
  },
];

export function ACRReport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (code: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedRows(newExpanded);
  };

  const handleExpandAll = () => {
    const allCodes = new Set<string>();
    const collectCodes = (rows: CostRow[]) => {
      rows.forEach(row => {
        if (row.children && row.children.length > 0) {
          allCodes.add(row.code);
          collectCodes(row.children);
        }
      });
    };
    collectCodes(costData);
    setExpandedRows(allCodes);
  };

  const handleCollapseAll = () => {
    setExpandedRows(new Set());
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return "";
    return `$${value.toLocaleString()}`;
  };

  const calculateTotals = () => {
    const totals = {
      approvedBudget: 0,
      contractValue: 0,
      approvedCORs: 0,
      pendingCORs: 0,
      committedCosts: 0,
      anticipatedCosts: 0,
      invoicedToDate: 0,
      balanceContractValue: 0,
      variance: 0,
    };

    costData.forEach(row => {
      totals.approvedBudget += row.approvedBudget;
      totals.contractValue += row.contractValue;
      totals.approvedCORs += row.approvedCORs;
      totals.pendingCORs += row.pendingCORs;
      totals.committedCosts += row.committedCosts;
      totals.anticipatedCosts += row.anticipatedCosts;
      totals.invoicedToDate += row.invoicedToDate;
      totals.balanceContractValue += row.balanceContractValue;
      totals.variance += row.variance;
    });

    return totals;
  };

  const totals = calculateTotals();

  const renderRows = (rows: CostRow[]) => {
    return rows.map((row) => {
      const isExpanded = expandedRows.has(row.code);
      const hasChildren = row.children && row.children.length > 0;

      return (
        <>
          <TableRow key={row.code} className="hover:bg-muted/50">
            <TableCell className="font-medium">
              <div className="flex items-center" style={{ paddingLeft: `${row.level * 20}px` }}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleRow(row.code)}
                    className="mr-2 hover:bg-muted rounded p-0.5"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <span className="mr-2 w-5"></span>
                )}
                <span className="font-semibold">{row.code}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">{row.description}</TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(row.approvedBudget)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.contractValue)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.approvedCORs)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.pendingCORs)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.committedCosts)}</TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(row.anticipatedCosts)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.invoicedToDate)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.balanceContractValue)}</TableCell>
            <TableCell className="text-right">
              {row.variance !== 0 && (
                <span className="text-green-600 font-semibold">
                  {formatCurrency(row.variance)}
                </span>
              )}
            </TableCell>
          </TableRow>
          {hasChildren && isExpanded && renderRows(row.children!)}
        </>
      );
    });
  };

  return (
    <div className="container px-6 py-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Master Estimate - Detailed Cost Report</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700" 
            onClick={handleExpandAll}
          >
            Expand All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
            onClick={handleCollapseAll}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px] font-semibold">Code</TableHead>
                  <TableHead className="min-w-[220px] font-semibold">Description</TableHead>
                  <TableHead className="text-right font-semibold">
                    Approved<br/>Budget
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Contract<br/>Value
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Approved<br/>CORs
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Pending<br/>CORs
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Committed<br/>Costs
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Anticipated<br/>Costs
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Invoiced to<br/>Date
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Balance<br/>Contract Value
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-2">
                      <span>Variance (vs.<br/>Budget)</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Search className="h-3 w-3 text-purple-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderRows(costData)}
                
                {/* Totals Row */}
                <TableRow className="bg-muted/30 font-bold border-t-2 border-primary">
                  <TableCell className="font-bold">TOTALS</TableCell>
                  <TableCell className="font-bold">Project Totals</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.approvedBudget)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.contractValue)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.approvedCORs)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.pendingCORs)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.committedCosts)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.anticipatedCosts)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.invoicedToDate)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totals.balanceContractValue)}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">{formatCurrency(totals.variance)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

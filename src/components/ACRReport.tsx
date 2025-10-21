import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, BarChart3, Filter } from "lucide-react";
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
            children: [
              {
                code: "A1818",
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
                level: 3,
                children: [
                  {
                    code: "A1818.01",
                    description: "Excavate foundations (CY)",
                    approvedBudget: 30000,
                    contractValue: 27294,
                    approvedCORs: 2099,
                    pendingCORs: 802,
                    committedCosts: 29393,
                    anticipatedCosts: 30000,
                    invoicedToDate: 16049,
                    balanceContractValue: 13344,
                    variance: 0,
                    level: 4,
                    children: [
                      {
                        code: "A1818.01.01",
                        description: "Excavate foundations (CY)",
                        approvedBudget: 30000,
                        contractValue: 27294,
                        approvedCORs: 2099,
                        pendingCORs: 802,
                        committedCosts: 29393,
                        anticipatedCosts: 30000,
                        invoicedToDate: 16049,
                        balanceContractValue: 13344,
                        variance: 0,
                        level: 5,
                      },
                    ],
                  },
                  {
                    code: "A1818.02",
                    description: "Footing formwork (SF)",
                    approvedBudget: 38400,
                    contractValue: 35352,
                    approvedCORs: 1044,
                    pendingCORs: 1037,
                    committedCosts: 36396,
                    anticipatedCosts: 37433,
                    invoicedToDate: 28664,
                    balanceContractValue: 7732,
                    variance: 967,
                    level: 4,
                    children: [
                      {
                        code: "A1818.02.01",
                        description: "Footing formwork (SF)",
                        approvedBudget: 38400,
                        contractValue: 35352,
                        approvedCORs: 1044,
                        pendingCORs: 1037,
                        committedCosts: 36396,
                        anticipatedCosts: 37433,
                        invoicedToDate: 28664,
                        balanceContractValue: 7732,
                        variance: 967,
                        level: 5,
                      },
                    ],
                  },
                  {
                    code: "A1818.03",
                    description: "Place reinforcing steel (#4/#5 bars, LB)",
                    approvedBudget: 40500,
                    contractValue: 34924,
                    approvedCORs: 2588,
                    pendingCORs: 981,
                    committedCosts: 37512,
                    anticipatedCosts: 38493,
                    invoicedToDate: 24532,
                    balanceContractValue: 12980,
                    variance: 2007,
                    level: 4,
                  },
                ],
              },
            ],
          },
          {
            code: "A20",
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
        children: [
          {
            code: "B18",
            description: "Floor Construction",
            approvedBudget: 1130000,
            contractValue: 1089770,
            approvedCORs: 54266,
            pendingCORs: 42392,
            committedCosts: 1144036,
            anticipatedCosts: 1130000,
            invoicedToDate: 881800,
            balanceContractValue: 262236,
            variance: 0,
            level: 2,
            children: [
              {
                code: "B1818",
                description: "Floor Construction",
                approvedBudget: 1130000,
                contractValue: 1089770,
                approvedCORs: 54266,
                pendingCORs: 42392,
                committedCosts: 1144036,
                anticipatedCosts: 1130000,
                invoicedToDate: 881800,
                balanceContractValue: 262236,
                variance: 0,
                level: 3,
                children: [
                  {
                    code: "B1818.01",
                    description: "Fabricate & erect steel beams/columns (LB)",
                    approvedBudget: 896000,
                    contractValue: 773397,
                    approvedCORs: 18222,
                    pendingCORs: 7901,
                    committedCosts: 791619,
                    anticipatedCosts: 799520,
                    invoicedToDate: 562962,
                    balanceContractValue: 228657,
                    variance: 96480,
                    level: 4,
                  },
                  {
                    code: "B1818.02",
                    description: "Cast-in-place floor slabs (CY)",
                    approvedBudget: 234000,
                    contractValue: 233960,
                    approvedCORs: 11208,
                    pendingCORs: 6262,
                    committedCosts: 245168,
                    anticipatedCosts: 234000,
                    invoicedToDate: 102211,
                    balanceContractValue: 142957,
                    variance: 0,
                    level: 4,
                  },
                ],
              },
            ],
          },
          {
            code: "B20",
            description: "Roof Construction",
            approvedBudget: 525000,
            contractValue: 464038,
            approvedCORs: 12366,
            pendingCORs: 6870,
            committedCosts: 476404,
            anticipatedCosts: 483274,
            invoicedToDate: 265661,
            balanceContractValue: 210743,
            variance: 41726,
            level: 2,
          },
        ],
      },
    ],
  },
];

export function ACRReport() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

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
    if (expandAll) {
      setExpandedRows(new Set());
    } else {
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
    }
    setExpandAll(!expandAll);
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const renderRows = (rows: CostRow[]) => {
    return rows.map((row) => {
      const isExpanded = expandedRows.has(row.code);
      const hasChildren = row.children && row.children.length > 0;

      return (
        <>
          <TableRow key={row.code} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center" style={{ paddingLeft: `${row.level * 20}px` }}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleRow(row.code)}
                    className="mr-2 hover:bg-muted rounded p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <span className="mr-2 w-6"></span>
                )}
                <span className="font-medium">{row.code}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">{row.description}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.approvedBudget)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.contractValue)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.approvedCORs)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.pendingCORs)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.committedCosts)}</TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(row.anticipatedCosts)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.invoicedToDate)}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.balanceContractValue)}</TableCell>
            <TableCell className="text-right">
              <span className={row.variance > 0 ? "text-green-600 font-semibold" : ""}>
                {row.variance > 0 ? `$${row.variance.toLocaleString()}` : "-"}
              </span>
            </TableCell>
          </TableRow>
          {hasChildren && isExpanded && renderRows(row.children!)}
        </>
      );
    });
  };

  return (
    <div className="container px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Master Estimate - Detailed Cost Report</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-green-600 border-green-600" onClick={handleExpandAll}>
            {expandAll ? "Collapse All" : "Expand All"}
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-600">
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
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center justify-between">
                      Code
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <BarChart3 className="h-3 w-3 text-purple-600" />
                          <span className="text-xs ml-1">Analyze</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Filter className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="text-right">Approved Budget</TableHead>
                  <TableHead className="text-right">Contract Value</TableHead>
                  <TableHead className="text-right">Approved CORs</TableHead>
                  <TableHead className="text-right">Pending CORs</TableHead>
                  <TableHead className="text-right">Committed Costs</TableHead>
                  <TableHead className="text-right">Anticipated Costs</TableHead>
                  <TableHead className="text-right">Invoiced to Date</TableHead>
                  <TableHead className="text-right">Balance Contract Value</TableHead>
                  <TableHead className="text-right">Variance (vs. Budget)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderRows(costData)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

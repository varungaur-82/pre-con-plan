import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface BudgetVersion {
  id: string;
  name: string;
  date: string;
  icon?: string;
}

interface BudgetItem {
  code: string;
  description: string;
  bidPackage: string;
  qty: string;
  unit: string;
  unitCost: string;
  total: number;
  subItems?: BudgetItem[];
}

const budgetVersions: BudgetVersion[] = [
  { id: "option-2", name: "Generated Option 2", date: "", icon: "🔄" },
  { id: "dd-s04", name: "DD-S04", date: "15/01/2024", icon: "💾" },
  { id: "dd-s04-b01", name: "DD-S04.B01", date: "22/01/2024", icon: "💾" },
  { id: "dd-s04-b02", name: "DD-S04.B02", date: "29/01/2024", icon: "💾" },
  { id: "dd-s04-b03", name: "DD-S04.B03", date: "05/02/2024", icon: "💾" },
  { id: "delta-budget", name: "Delta Budget", date: "28/10/2025", icon: "💾" },
];

// Baseline data (DD-S04)
const baselineData: BudgetItem[] = [
  {
    code: "A",
    description: "Substructure",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 918600,
    subItems: [
      { code: "A10", description: "Foundations", bidPackage: "Concrete Works", qty: "2,500", unit: "CY", unitCost: "$180", total: 450000 },
      { code: "A20", description: "Basement Construction", bidPackage: "Concrete Works", qty: "15,000", unit: "SF", unitCost: "$22", total: 330000 },
      { code: "A30", description: "Basement Waterproofing", bidPackage: "Waterproofing", qty: "15,000", unit: "SF", unitCost: "$8", total: 120000 },
      { code: "A40", description: "Underpinning", bidPackage: "Specialty", qty: "200", unit: "LF", unitCost: "$92", total: 18600 },
    ]
  },
  {
    code: "B",
    description: "Shell",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 5608000,
    subItems: [
      { code: "B10", description: "Superstructure", bidPackage: "Structural Steel", qty: "850", unit: "TON", unitCost: "$4,200", total: 3570000 },
      { code: "B20", description: "Exterior Enclosure", bidPackage: "Curtain Wall", qty: "30,000", unit: "SF", unitCost: "$42", total: 1260000 },
      { code: "B30", description: "Roofing", bidPackage: "Roofing", qty: "12,000", unit: "SF", unitCost: "$32", total: 384000 },
      { code: "B40", description: "Exterior Windows", bidPackage: "Glazing", qty: "5,500", unit: "SF", unitCost: "$72", total: 396000 },
    ]
  },
  {
    code: "C",
    description: "Interiors",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 3484214,
    subItems: [
      { code: "C10", description: "Interior Construction", bidPackage: "Drywall", qty: "85,000", unit: "SF", unitCost: "$18", total: 1530000 },
      { code: "C20", description: "Interior Finishes", bidPackage: "Finishes", qty: "75,000", unit: "SF", unitCost: "$15", total: 1125000 },
      { code: "C30", description: "Flooring", bidPackage: "Flooring", qty: "65,000", unit: "SF", unitCost: "$12", total: 780000 },
    ]
  },
  {
    code: "D",
    description: "Services (MEP)",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 7341230,
    subItems: [
      { code: "D10", description: "Conveying Systems", bidPackage: "Elevators", qty: "4", unit: "EA", unitCost: "$185,000", total: 740000 },
      { code: "D20", description: "Plumbing", bidPackage: "Plumbing", qty: "75,000", unit: "SF", unitCost: "$22", total: 1650000 },
      { code: "D30", description: "HVAC", bidPackage: "HVAC", qty: "75,000", unit: "SF", unitCost: "$35", total: 2625000 },
      { code: "D40", description: "Fire Protection", bidPackage: "Fire Protection", qty: "75,000", unit: "SF", unitCost: "$8", total: 600000 },
      { code: "D50", description: "Electrical", bidPackage: "Electrical", qty: "75,000", unit: "SF", unitCost: "$22", total: 1726230 },
    ]
  },
];

// Comparison data (DD-S04.B02) - with some changes
const comparisonData: BudgetItem[] = [
  {
    code: "A",
    description: "Substructure",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 918600,
    subItems: [
      { code: "A10", description: "Foundations", bidPackage: "Concrete Works", qty: "2,500", unit: "CY", unitCost: "$180", total: 450000 },
      { code: "A20", description: "Basement Construction", bidPackage: "Concrete Works", qty: "15,000", unit: "SF", unitCost: "$22", total: 330000 },
      { code: "A30", description: "Basement Waterproofing", bidPackage: "Waterproofing", qty: "15,000", unit: "SF", unitCost: "$8", total: 120000 },
      { code: "A40", description: "Underpinning", bidPackage: "Specialty", qty: "200", unit: "LF", unitCost: "$92", total: 18600 },
    ]
  },
  {
    code: "B",
    description: "Shell",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 5608000,
    subItems: [
      { code: "B10", description: "Superstructure", bidPackage: "Structural Steel", qty: "850", unit: "TON", unitCost: "$4,200", total: 3570000 },
      { code: "B20", description: "Exterior Enclosure", bidPackage: "Curtain Wall", qty: "30,000", unit: "SF", unitCost: "$42", total: 1260000 },
      { code: "B30", description: "Roofing", bidPackage: "Roofing", qty: "12,000", unit: "SF", unitCost: "$32", total: 384000 },
      { code: "B40", description: "Exterior Windows", bidPackage: "Glazing", qty: "5,500", unit: "SF", unitCost: "$72", total: 396000 },
    ]
  },
  {
    code: "C",
    description: "Interior finishes reduced",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2374394,
    subItems: [
      { code: "C10", description: "Interior Construction", bidPackage: "Drywall", qty: "75,000", unit: "SF", unitCost: "$15", total: 1125000 },
      { code: "C20", description: "Interior Finishes", bidPackage: "Finishes", qty: "65,000", unit: "SF", unitCost: "$12", total: 780000 },
      { code: "C30", description: "Flooring", bidPackage: "Flooring", qty: "55,000", unit: "SF", unitCost: "$8.5", total: 469394 },
    ]
  },
  {
    code: "D",
    description: "MEP systems optimized",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 5716528,
    subItems: [
      { code: "D10", description: "Conveying Systems", bidPackage: "Elevators", qty: "3", unit: "EA", unitCost: "$155,000", total: 465000 },
      { code: "D20", description: "Plumbing", bidPackage: "Plumbing", qty: "75,000", unit: "SF", unitCost: "$18", total: 1350000 },
      { code: "D30", description: "HVAC", bidPackage: "HVAC", qty: "75,000", unit: "SF", unitCost: "$28", total: 2100000 },
      { code: "D40", description: "Fire Protection", bidPackage: "Fire Protection", qty: "75,000", unit: "SF", unitCost: "$8", total: 600000 },
      { code: "D50", description: "Electrical", bidPackage: "Electrical", qty: "75,000", unit: "SF", unitCost: "$16.02", total: 1201528 },
    ]
  },
];

export function CompareBudgets() {
  const [baselineVersion, setBaselineVersion] = useState<string>("");
  const [comparisonVersion, setComparisonVersion] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [expandedRowsBaseline, setExpandedRowsBaseline] = useState<Set<string>>(new Set());
  const [expandedRowsComparison, setExpandedRowsComparison] = useState<Set<string>>(new Set());

  const toggleRowBaseline = (code: string) => {
    const newExpanded = new Set(expandedRowsBaseline);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedRowsBaseline(newExpanded);
  };

  const toggleRowComparison = (code: string) => {
    const newExpanded = new Set(expandedRowsComparison);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedRowsComparison(newExpanded);
  };

  const handleCompare = () => {
    if (baselineVersion && comparisonVersion) {
      setIsComparing(true);
    }
  };

  const handleReset = () => {
    setIsComparing(false);
    setExpandedRowsBaseline(new Set());
    setExpandedRowsComparison(new Set());
  };

  const expandAll = () => {
    setExpandedRowsBaseline(new Set(baselineData.map(item => item.code)));
    setExpandedRowsComparison(new Set(comparisonData.map(item => item.code)));
  };

  const collapseAll = () => {
    setExpandedRowsBaseline(new Set());
    setExpandedRowsComparison(new Set());
  };

  const formatCurrency = (value: number) => {
    return `US$${value.toLocaleString()}`;
  };

  const baselineTotal = baselineData.reduce((sum, item) => sum + item.total, 0);
  const comparisonTotal = comparisonData.reduce((sum, item) => sum + item.total, 0);
  const delta = comparisonTotal - baselineTotal;
  const deltaPercent = ((delta / baselineTotal) * 100).toFixed(2);

  if (!isComparing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/20">
        <Card className="w-full max-w-4xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Select Versions to Compare</h2>
            <p className="text-muted-foreground">
              Choose two budget versions to compare side by side
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Baseline Version */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Baseline Version</label>
              <Select value={baselineVersion} onValueChange={setBaselineVersion}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select baseline..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {budgetVersions.map((version) => (
                    <SelectItem key={version.id} value={version.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span>{version.icon}</span>
                        <div>
                          <div className="font-medium">{version.name}</div>
                          {version.date && (
                            <div className="text-xs text-muted-foreground">{version.date}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {baselineVersion && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    {budgetVersions.find(v => v.id === baselineVersion)?.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Baseline</span>
                </div>
              )}
            </div>

            {/* Comparison Version */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Comparison Version</label>
              <Select value={comparisonVersion} onValueChange={setComparisonVersion}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select comparison..." />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {budgetVersions.map((version) => (
                    <SelectItem key={version.id} value={version.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span>{version.icon}</span>
                        <div>
                          <div className="font-medium">{version.name}</div>
                          {version.date && (
                            <div className="text-xs text-muted-foreground">{version.date}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {comparisonVersion && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    {budgetVersions.find(v => v.id === comparisonVersion)?.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Compare</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleCompare}
              disabled={!baselineVersion || !comparisonVersion}
              size="lg"
              className="min-w-[200px]"
            >
              <FileText className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Budget Comparison</h2>
            <p className="text-sm text-muted-foreground">
              Comparing: {budgetVersions.find(v => v.id === baselineVersion)?.name} vs{" "}
              {budgetVersions.find(v => v.id === comparisonVersion)?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Change Selection
            </Button>
            <Button variant="ghost" size="sm" onClick={expandAll}>
              Expand all
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              Collapse all
            </Button>
          </div>
        </div>

        {/* Delta Summary */}
        <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Net Delta vs Baseline</div>
            <div className={`text-2xl font-bold ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {delta > 0 ? '+' : ''}{formatCurrency(Math.abs(delta))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">% Change</div>
            <div className={`text-2xl font-bold ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {delta > 0 ? '+' : ''}{deltaPercent}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Validation Issues</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="text-red-600">0</span>
              <span className="text-yellow-600">31</span>
              <span className="text-green-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Tables */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 divide-x min-h-full">
          {/* Baseline Table */}
          <div className="overflow-auto">
            <div className="sticky top-0 bg-muted/50 border-b p-3 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-1">Baseline</Badge>
                  <div className="text-sm font-medium">
                    {budgetVersions.find(v => v.id === baselineVersion)?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Project Total:</div>
                  <div className="font-bold">{formatCurrency(baselineTotal)}</div>
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead className="sticky top-16 bg-muted/30 border-b text-xs z-10">
                <tr>
                  <th className="text-left p-2 font-medium">CODE & DESCRIPTION</th>
                  <th className="text-right p-2 font-medium">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {baselineData.map((item) => {
                  const isExpanded = expandedRowsBaseline.has(item.code);
                  return (
                    <>
                      <tr key={item.code} className="border-b hover:bg-muted/30">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRowBaseline(item.code)}
                              className="hover:bg-muted rounded p-0.5"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {item.code}
                            </Badge>
                            <span className="font-medium text-sm">{item.description}</span>
                          </div>
                        </td>
                        <td className="p-2 text-right font-semibold text-sm">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                      {isExpanded && item.subItems?.map((subItem) => (
                        <tr key={`${item.code}-${subItem.code}`} className="border-b bg-muted/10 hover:bg-muted/20">
                          <td className="p-2 pl-10">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {subItem.code}
                              </Badge>
                              <span className="text-xs">{subItem.description}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right text-xs font-medium">
                            {formatCurrency(subItem.total)}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Comparison Table */}
          <div className="overflow-auto">
            <div className="sticky top-0 bg-muted/50 border-b p-3 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-1">Compare</Badge>
                  <div className="text-sm font-medium">
                    {budgetVersions.find(v => v.id === comparisonVersion)?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Project Total:</div>
                  <div className="font-bold">{formatCurrency(comparisonTotal)}</div>
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead className="sticky top-16 bg-muted/30 border-b text-xs z-10">
                <tr>
                  <th className="text-left p-2 font-medium">CODE & DESCRIPTION</th>
                  <th className="text-right p-2 font-medium">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item) => {
                  const isExpanded = expandedRowsComparison.has(item.code);
                  return (
                    <>
                      <tr key={item.code} className="border-b hover:bg-muted/30">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRowComparison(item.code)}
                              className="hover:bg-muted rounded p-0.5"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {item.code}
                            </Badge>
                            <span className="font-medium text-sm">{item.description}</span>
                          </div>
                        </td>
                        <td className="p-2 text-right font-semibold text-sm">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                      {isExpanded && item.subItems?.map((subItem) => (
                        <tr key={`${item.code}-${subItem.code}`} className="border-b bg-muted/10 hover:bg-muted/20">
                          <td className="p-2 pl-10">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {subItem.code}
                              </Badge>
                              <span className="text-xs">{subItem.description}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right text-xs font-medium">
                            {formatCurrency(subItem.total)}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface EstimateItem {
  code: string;
  description: string;
  bidPackage: string;
  qty: string;
  unit: string;
  unitCost: string;
  total: number;
  subItems?: EstimateItem[];
}

const estimateData: EstimateItem[] = [
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
      { code: "A40", description: "Underpinning", bidPackage: "Specialty", qty: "200", unit: "LF", unitCost: "$92", total: 18400 },
    ]
  },
  {
    code: "B",
    description: "Shell",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 6608000,
    subItems: [
      { code: "B10", description: "Superstructure", bidPackage: "Structural Steel", qty: "850", unit: "TON", unitCost: "$4,200", total: 3570000 },
      { code: "B20", description: "Exterior Enclosure", bidPackage: "Curtain Wall", qty: "45,000", unit: "SF", unitCost: "$55", total: 2475000 },
      { code: "B30", description: "Roofing", bidPackage: "Roofing", qty: "12,000", unit: "SF", unitCost: "$32", total: 384000 },
      { code: "B40", description: "Exterior Windows", bidPackage: "Glazing", qty: "8,500", unit: "SF", unitCost: "$95", total: 807500 },
      { code: "B50", description: "Exterior Doors", bidPackage: "Specialty", qty: "25", unit: "EA", unitCost: "$6,860", total: 171500 },
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
      { code: "C40", description: "Ceiling Systems", bidPackage: "Ceilings", qty: "60,000", unit: "SF", unitCost: "$8.16", total: 489600 },
      { code: "C50", description: "Interior Doors/Windows", bidPackage: "Millwork", qty: "120", unit: "EA", unitCost: "$1,330", total: 159614 },
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
      { code: "D50", description: "Electrical", bidPackage: "Electrical", qty: "75,000", unit: "SF", unitCost: "$29.42", total: 1726230 },
    ]
  },
  {
    code: "E",
    description: "Equipment & Furnishings",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1288938,
    subItems: [
      { code: "E10", description: "Equipment", bidPackage: "Kitchen Equip", qty: "1", unit: "LS", unitCost: "$450,000", total: 450000 },
      { code: "E20", description: "Furnishings", bidPackage: "Furniture", qty: "450", unit: "EA", unitCost: "$1,200", total: 540000 },
      { code: "E30", description: "Special Construction", bidPackage: "Specialty", qty: "1", unit: "LS", unitCost: "$298,938", total: 298938 },
    ]
  },
  {
    code: "F",
    description: "Special Construction & Demolition",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 4166824,
    subItems: [
      { code: "F10", description: "Special Construction", bidPackage: "Specialty", qty: "1", unit: "LS", unitCost: "$2,850,000", total: 2850000 },
      { code: "F20", description: "Selective Demolition", bidPackage: "Demo", qty: "25,000", unit: "SF", unitCost: "$15", total: 375000 },
      { code: "F30", description: "Hazmat Abatement", bidPackage: "Hazmat", qty: "18,000", unit: "SF", unitCost: "$22", total: 396000 },
      { code: "F40", description: "Shoring & Bracing", bidPackage: "Specialty", qty: "1", unit: "LS", unitCost: "$545,824", total: 545824 },
    ]
  },
  {
    code: "G",
    description: "Sitework",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 150500,
    subItems: [
      { code: "G10", description: "Site Preparation", bidPackage: "Sitework", qty: "1", unit: "LS", unitCost: "$45,000", total: 45000 },
      { code: "G20", description: "Site Improvements", bidPackage: "Sitework", qty: "2,500", unit: "SF", unitCost: "$18", total: 45000 },
      { code: "G30", description: "Utilities", bidPackage: "Civil", qty: "1", unit: "LS", unitCost: "$38,500", total: 38500 },
      { code: "G40", description: "Landscaping", bidPackage: "Landscape", qty: "1", unit: "LS", unitCost: "$22,000", total: 22000 },
    ]
  },
  {
    code: "Z",
    description: "General Requirements",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2722843,
    subItems: [
      { code: "Z10", description: "Project Management", bidPackage: "GC", qty: "24", unit: "MO", unitCost: "$45,000", total: 1080000 },
      { code: "Z20", description: "Site Facilities", bidPackage: "GC", qty: "1", unit: "LS", unitCost: "$285,000", total: 285000 },
      { code: "Z30", description: "Testing & Inspections", bidPackage: "Testing", qty: "1", unit: "LS", unitCost: "$125,000", total: 125000 },
      { code: "Z40", description: "Permits & Fees", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$892,843", total: 892843 },
      { code: "Z50", description: "Insurance", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$340,000", total: 340000 },
    ]
  },
  {
    code: "SC",
    description: "Owner Soft Costs",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2822329,
    subItems: [
      { code: "SC10", description: "Architectural Fees", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$1,250,000", total: 1250000 },
      { code: "SC20", description: "Engineering Fees", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$850,000", total: 850000 },
      { code: "SC30", description: "Consultants", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$420,000", total: 420000 },
      { code: "SC40", description: "Legal & Admin", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$302,329", total: 302329 },
    ]
  },
  {
    code: "FF",
    description: "FF&E",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 301599,
    subItems: [
      { code: "FF10", description: "Furniture", bidPackage: "Furniture", qty: "250", unit: "EA", unitCost: "$800", total: 200000 },
      { code: "FF20", description: "Fixtures", bidPackage: "Fixtures", qty: "85", unit: "EA", unitCost: "$650", total: 55250 },
      { code: "FF30", description: "Equipment", bidPackage: "Equipment", qty: "1", unit: "LS", unitCost: "$46,349", total: 46349 },
    ]
  },
  {
    code: "IT",
    description: "IT",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 158736,
    subItems: [
      { code: "IT10", description: "Data Cabling", bidPackage: "Low Voltage", qty: "75,000", unit: "SF", unitCost: "$1.20", total: 90000 },
      { code: "IT20", description: "Network Equipment", bidPackage: "IT Vendor", qty: "1", unit: "LS", unitCost: "$42,000", total: 42000 },
      { code: "IT30", description: "AV Systems", bidPackage: "AV Vendor", qty: "1", unit: "LS", unitCost: "$26,736", total: 26736 },
    ]
  },
  {
    code: "AV",
    description: "AV",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 80003,
    subItems: [
      { code: "AV10", description: "Conference Room AV", bidPackage: "AV Vendor", qty: "8", unit: "EA", unitCost: "$6,500", total: 52000 },
      { code: "AV20", description: "Digital Signage", bidPackage: "AV Vendor", qty: "12", unit: "EA", unitCost: "$2,333", total: 28003 },
    ]
  },
  {
    code: "SEC",
    description: "Security",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 72384,
    subItems: [
      { code: "SEC10", description: "Access Control", bidPackage: "Security", qty: "1", unit: "LS", unitCost: "$45,000", total: 45000 },
      { code: "SEC20", description: "CCTV System", bidPackage: "Security", qty: "35", unit: "EA", unitCost: "$782", total: 27384 },
    ]
  },
  {
    code: "FIN",
    description: "Financing",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1904834,
    subItems: [
      { code: "FIN10", description: "Construction Loan Interest", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$1,450,000", total: 1450000 },
      { code: "FIN20", description: "Loan Fees", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$454,834", total: 454834 },
    ]
  },
  {
    code: "CONT",
    description: "Contingency",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2381042,
    subItems: [
      { code: "CONT10", description: "Design Contingency", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$1,200,000", total: 1200000 },
      { code: "CONT20", description: "Construction Contingency", bidPackage: "GC", qty: "1", unit: "LS", unitCost: "$850,000", total: 850000 },
      { code: "CONT30", description: "Owner Contingency", bidPackage: "Owner", qty: "1", unit: "LS", unitCost: "$331,042", total: 331042 },
    ]
  },
  {
    code: "COMM",
    description: "Commissioning",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 380987,
    subItems: [
      { code: "COMM10", description: "MEP Commissioning", bidPackage: "Cx Agent", qty: "1", unit: "LS", unitCost: "$285,000", total: 285000 },
      { code: "COMM20", description: "Envelope Commissioning", bidPackage: "Cx Agent", qty: "1", unit: "LS", unitCost: "$95,987", total: 95987 },
    ]
  },
];

export function EstimateGenerator() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRow = (code: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedRows(newExpanded);
  };

  const expandAll = () => {
    setExpandedRows(new Set(estimateData.map(item => item.code)));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const formatCurrency = (value: number) => {
    return `US$${value.toLocaleString()}`;
  };

  const totalProject = estimateData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Estimated Budget - Option 2</h2>
            <p className="text-sm text-muted-foreground">Design Option B</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Budget: Delta Budget
            </Button>
            <Button variant="default" size="sm">
              Save Revision
            </Button>
            <Button variant="ghost" size="sm">
              History
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-medium">Master Estimate - Option 2</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                CSI
              </Button>
              <Button variant="ghost" size="sm">
                Spaces
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search code, description, packs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={expandAll}>
              Expand all
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              Collapse all
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Uniformat → CSI → Bid Packages → Task line items. Click rows to expand.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">Advanced Cost Controls</Badge>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/50 border-b z-10">
            <tr className="text-xs font-medium text-muted-foreground">
              <th className="text-left p-3 font-medium">
                CODE & DESCRIPTION<br />
                <span className="text-[10px]">ACTIONS</span>
              </th>
              <th className="text-left p-3 font-medium">BID PACKAGE</th>
              <th className="text-right p-3 font-medium">QTY</th>
              <th className="text-right p-3 font-medium">UNIT</th>
              <th className="text-right p-3 font-medium">UNIT COST</th>
              <th className="text-right p-3 font-medium">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {estimateData.map((item) => {
              const isExpanded = expandedRows.has(item.code);
              return (
                <>
                  {/* Main Row */}
                  <tr key={item.code} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(item.code)}
                          className="hover:bg-muted rounded p-0.5 transition-colors"
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
                        <span className="font-medium">{item.description}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-auto"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{item.bidPackage}</td>
                    <td className="p-3 text-right text-muted-foreground">{item.qty}</td>
                    <td className="p-3 text-right text-muted-foreground">{item.unit}</td>
                    <td className="p-3 text-right text-muted-foreground">{item.unitCost}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                  </tr>

                  {/* Sub Items */}
                  {isExpanded && item.subItems?.map((subItem) => (
                    <tr key={`${item.code}-${subItem.code}`} className="border-b bg-muted/10 hover:bg-muted/20 transition-colors">
                      <td className="p-3 pl-12">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {subItem.code}
                          </Badge>
                          <span className="text-sm">{subItem.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-auto"
                            onClick={() => setEditingItem(subItem)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{subItem.bidPackage}</td>
                      <td className="p-3 text-right text-sm">{subItem.qty}</td>
                      <td className="p-3 text-right text-sm">{subItem.unit}</td>
                      <td className="p-3 text-right text-sm">{subItem.unitCost}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(subItem.total)}</td>
                    </tr>
                  ))}
                </>
              );
            })}

            {/* Total Row */}
            <tr className="border-t-2 bg-muted/30 font-semibold">
              <td className="p-3" colSpan={5}>
                <div className="flex justify-end">Project Total:</div>
              </td>
              <td className="p-3 text-right text-lg">{formatCurrency(totalProject)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Estimate Item</DialogTitle>
            <DialogDescription>
              Update the details for {editingItem?.code} - {editingItem?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input defaultValue={editingItem?.code} />
              </div>
              <div className="space-y-2">
                <Label>Bid Package</Label>
                <Input defaultValue={editingItem?.bidPackage} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input defaultValue={editingItem?.description} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input defaultValue={editingItem?.qty} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input defaultValue={editingItem?.unit} />
              </div>
              <div className="space-y-2">
                <Label>Unit Cost</Label>
                <Input defaultValue={editingItem?.unitCost} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total</Label>
              <Input 
                defaultValue={editingItem?.total ? formatCurrency(editingItem.total) : ""} 
                disabled 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditingItem(null)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

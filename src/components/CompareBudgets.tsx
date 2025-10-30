import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, RefreshCw, Info, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditRecipeDialog } from "@/components/EditRecipeDialog";

interface BudgetVersion {
  id: string;
  name: string;
  date: string;
  icon?: string;
}

interface BudgetItem {
  code: string;
  description: string;
  note?: string;
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
  {
    code: "E",
    description: "Equipment & Furnishings",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1288938,
  },
  {
    code: "F",
    description: "Special Construction & Demolition",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 4166824,
  },
  {
    code: "G",
    description: "Sitework",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 150500,
  },
  {
    code: "Z",
    description: "General Requirements",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2722643,
  },
  {
    code: "SC",
    description: "Owner Soft Costs",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2822329,
  },
  {
    code: "FF",
    description: "FF&E",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 301599,
  },
  {
    code: "IT",
    description: "IT",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 158736,
  },
  {
    code: "AV",
    description: "AV",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 80003,
  },
  {
    code: "SEC",
    description: "Security",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 72384,
  },
  {
    code: "FIN",
    description: "Financing",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1904834,
  },
  {
    code: "CONT",
    description: "Contingency",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2381042,
  },
  {
    code: "COMM",
    description: "Commissioning",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 380967,
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
    description: "Interiors",
    note: "Interior finishes reduced",
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
    description: "Services (MEP)",
    note: "MEP systems optimized",
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
  {
    code: "E",
    description: "Equipment & Furnishings",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1288938,
  },
  {
    code: "F",
    description: "Special Construction & Demolition",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 4166824,
  },
  {
    code: "G",
    description: "Sitework",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 150500,
  },
  {
    code: "Z",
    description: "General Requirements",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2722643,
  },
  {
    code: "SC",
    description: "Owner Soft Costs",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 2822329,
  },
  {
    code: "FF",
    description: "FF&E",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 301599,
  },
  {
    code: "IT",
    description: "IT",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 158736,
  },
  {
    code: "AV",
    description: "AV",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 80003,
  },
  {
    code: "SEC",
    description: "Security",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 72384,
  },
  {
    code: "FIN",
    description: "Financing",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1904834,
  },
  {
    code: "CONT",
    description: "Contingency",
    note: "Interior finishes reduced",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1622613,
  },
  {
    code: "COMM",
    description: "Commissioning",
    note: "Interior finishes reduced",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 259618,
  },
];

// Baseline Spaces Data
const baselineSpacesData: BudgetItem[] = [
  {
    code: "Main Building",
    description: "Main Building",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1052607,
    subItems: [
      {
        code: "LEVEL5",
        description: "Level 5",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 73096,
        subItems: [
          {
            code: "OFFICE",
            description: "Office (Tenant, Standard Finish)",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 55156,
            subItems: [
              {
                code: "Office",
                description: "Office Suite 501 - 2500 SF",
                bidPackage: "—",
                qty: "—",
                unit: "—",
                unitCost: "—",
                total: 55156,
                note: "84% vs benchmark",
                subItems: [
                  { code: "09 26 13", description: "Gypsum Board Walls", bidPackage: "Interior", qty: "1,250", unit: "SF", unitCost: "$2.50", total: 3125 },
                  { code: "09 51 13", description: "Acoustical Ceiling", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "$3.75", total: 9375 },
                  { code: "09 68 16", description: "Carpet Flooring", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "$8.50", total: 21250 },
                  { code: "26 51 13", description: "Lighting Fixtures", bidPackage: "Electrical", qty: "25", unit: "EA", unitCost: "$450.00", total: 11250 },
                  { code: "23 37 13", description: "Supply Air Diffusers", bidPackage: "HVAC", qty: "31.25", unit: "EA", unitCost: "$325.00", total: 10156 },
                ],
              },
            ],
          },
          {
            code: "Restroom",
            description: "Restroom (Owner, Standard Finish)",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 17940,
            subItems: [
              { code: "09 30 13", description: "Ceramic Tile Walls", bidPackage: "Interior", qty: "450", unit: "SF", unitCost: "$12.50", total: 5625 },
              { code: "09 65 13", description: "Resilient Flooring", bidPackage: "Interior", qty: "350", unit: "SF", unitCost: "$6.75", total: 2363 },
              { code: "22 41 13", description: "Plumbing Fixtures", bidPackage: "Plumbing", qty: "8", unit: "EA", unitCost: "$875.00", total: 7000 },
              { code: "26 56 13", description: "Emergency Lighting", bidPackage: "Electrical", qty: "6", unit: "EA", unitCost: "$325.50", total: 1953 },
              { code: "23 34 13", description: "Exhaust Fans", bidPackage: "HVAC", qty: "4", unit: "EA", unitCost: "$249.75", total: 999 },
            ],
          },
        ],
      },
      {
        code: "LEVEL6",
        description: "Level 6",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 79715,
        subItems: [
          {
            code: "Lobby",
            description: "Lobby",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 79715,
            subItems: [
              { code: "09 30 23", description: "Stone Tile Flooring", bidPackage: "Interior", qty: "600", unit: "SF", unitCost: "$35.00", total: 21000 },
              { code: "09 90 13", description: "Feature Wall Finish", bidPackage: "Interior", qty: "250", unit: "SF", unitCost: "$38.00", total: 9500 },
              { code: "09 51 23", description: "Premium Acoustical Ceiling", bidPackage: "Interior", qty: "2,800", unit: "SF", unitCost: "$5.25", total: 14700 },
              { code: "26 51 19", description: "LED Lighting Fixtures", bidPackage: "Electrical", qty: "30", unit: "EA", unitCost: "$575.00", total: 17250 },
              { code: "12 48 13", description: "Custom Reception Desk", bidPackage: "Millwork", qty: "1", unit: "EA", unitCost: "$17,265.00", total: 17265 },
            ],
          },
        ],
      },
    ],
  },
];

// Comparison Spaces Data  
const comparisonSpacesData: BudgetItem[] = [
  {
    code: "Main Building",
    description: "Main Building",
    bidPackage: "—",
    qty: "—",
    unit: "—",
    unitCost: "—",
    total: 1052607,
    subItems: [
      {
        code: "LEVEL5",
        description: "Level 5",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 73096,
        subItems: [
          {
            code: "OFFICE",
            description: "Office (Tenant, Standard Finish)",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 55156,
            subItems: [
              {
                code: "Office",
                description: "Office Suite 501 - 2500 SF",
                bidPackage: "—",
                qty: "—",
                unit: "—",
                unitCost: "—",
                total: 55156,
                note: "84% vs benchmark",
                subItems: [
                  { code: "09 26 13", description: "Gypsum Board Walls", bidPackage: "Interior", qty: "1,250", unit: "SF", unitCost: "$2.50", total: 3125 },
                  { code: "09 51 13", description: "Acoustical Ceiling", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "$3.75", total: 9375 },
                  { code: "09 68 16", description: "Carpet Flooring", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "$8.50", total: 21250 },
                  { code: "26 51 13", description: "Lighting Fixtures", bidPackage: "Electrical", qty: "25", unit: "EA", unitCost: "$450.00", total: 11250 },
                  { code: "23 37 13", description: "Supply Air Diffusers", bidPackage: "HVAC", qty: "31.25", unit: "EA", unitCost: "$325.00", total: 10156 },
                ],
              },
            ],
          },
          {
            code: "Restroom",
            description: "Restroom (Owner, Standard Finish)",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 17940,
            subItems: [
              { code: "09 30 13", description: "Ceramic Tile Walls", bidPackage: "Interior", qty: "450", unit: "SF", unitCost: "$12.50", total: 5625 },
              { code: "09 65 13", description: "Resilient Flooring", bidPackage: "Interior", qty: "350", unit: "SF", unitCost: "$6.75", total: 2363 },
              { code: "22 41 13", description: "Plumbing Fixtures", bidPackage: "Plumbing", qty: "8", unit: "EA", unitCost: "$875.00", total: 7000 },
              { code: "26 56 13", description: "Emergency Lighting", bidPackage: "Electrical", qty: "6", unit: "EA", unitCost: "$325.50", total: 1953 },
              { code: "23 34 13", description: "Exhaust Fans", bidPackage: "HVAC", qty: "4", unit: "EA", unitCost: "$249.75", total: 999 },
            ],
          },
        ],
      },
      {
        code: "LEVEL6",
        description: "Level 6",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 79715,
        subItems: [
          {
            code: "Lobby",
            description: "Lobby",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 79715,
            subItems: [
              { code: "09 30 23", description: "Stone Tile Flooring", bidPackage: "Interior", qty: "600", unit: "SF", unitCost: "$35.00", total: 21000 },
              { code: "09 90 13", description: "Feature Wall Finish", bidPackage: "Interior", qty: "250", unit: "SF", unitCost: "$38.00", total: 9500 },
              { code: "09 51 23", description: "Premium Acoustical Ceiling", bidPackage: "Interior", qty: "2,800", unit: "SF", unitCost: "$5.25", total: 14700 },
              { code: "26 51 19", description: "LED Lighting Fixtures", bidPackage: "Electrical", qty: "30", unit: "EA", unitCost: "$575.00", total: 17250 },
              { code: "12 48 13", description: "Custom Reception Desk", bidPackage: "Millwork", qty: "1", unit: "EA", unitCost: "$17,265.00", total: 17265 },
            ],
          },
        ],
      },
    ],
  },
];

export function CompareBudgets() {
  const [baselineVersion, setBaselineVersion] = useState<string>("");
  const [comparisonVersion, setComparisonVersion] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [activeView, setActiveView] = useState<'csi' | 'spaces'>('csi');
  const [expandedRowsBaseline, setExpandedRowsBaseline] = useState<Set<string>>(new Set());
  const [expandedRowsComparison, setExpandedRowsComparison] = useState<Set<string>>(new Set());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ code: string; description: string } | null>(null);
  
  const currentBaselineData = activeView === 'csi' ? baselineData : baselineSpacesData;
  const currentComparisonData = activeView === 'csi' ? comparisonData : comparisonSpacesData;

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
    setExpandedRowsBaseline(new Set(currentBaselineData.map(item => item.code)));
    setExpandedRowsComparison(new Set(currentComparisonData.map(item => item.code)));
  };

  const collapseAll = () => {
    setExpandedRowsBaseline(new Set());
    setExpandedRowsComparison(new Set());
  };

  const handleEditItem = (code: string, description: string) => {
    setEditingItem({ code, description });
    setEditDialogOpen(true);
  };

  // Recursive rendering function for nested rows
  const renderRows = (
    items: BudgetItem[], 
    expandedRows: Set<string>, 
    toggleRow: (code: string) => void, 
    level: number = 0,
    isBaseline: boolean = true
  ): JSX.Element[] => {
    const results: JSX.Element[] = [];
    
    items.forEach((item) => {
      const isExpanded = expandedRows.has(item.code);
      const paddingLeft = level * 24 + 8;
      
      results.push(
        <tr 
          key={item.code}
          className="border-b hover:bg-muted/20"
        >
          <td className="p-2">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${paddingLeft}px` }}>
              {item.subItems && item.subItems.length > 0 && (
                <button 
                  onClick={() => toggleRow(item.code)}
                  className="p-0 hover:bg-accent rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              {(!item.subItems || item.subItems.length === 0) && (
                <div className="w-4" />
              )}
              <input 
                type="checkbox" 
                className="rounded" 
                onClick={(e) => e.stopPropagation()} 
              />
              <Badge 
                variant={level === 0 ? "secondary" : "outline"} 
                className={level === 0 ? "bg-foreground text-background font-bold px-2 py-0.5 text-xs rounded" : "font-mono text-xs px-1.5 py-0"}
              >
                {item.code}
              </Badge>
              <div className="flex items-center gap-1.5">
                <span className={level > 0 ? "text-sm" : ""}>{item.description}</span>
                <button 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditItem(item.code, item.description);
                  }}
                >
                  ✏️
                </button>
              </div>
            </div>
            {item.note && (
              <div className="text-xs text-muted-foreground mt-0.5" style={{ paddingLeft: `${paddingLeft + 88}px` }}>
                📝 {item.note}
              </div>
            )}
          </td>
          <td className="p-2 text-sm text-center">{item.bidPackage}</td>
          <td className="p-2 text-center text-sm">{item.qty}</td>
          <td className="p-2 text-center text-sm">{item.unit}</td>
          <td className="p-2 text-right text-sm">{item.unitCost}</td>
          <td className="p-2 text-right font-semibold">{formatCurrency(item.total)}</td>
        </tr>
      );
      
      if (isExpanded && item.subItems && item.subItems.length > 0) {
        results.push(...renderRows(item.subItems, expandedRows, toggleRow, level + 1, isBaseline));
      }
    });
    
    return results;
  };

  const formatCurrency = (value: number) => {
    return `US$${value.toLocaleString()}`;
  };

  const baselineTotal = currentBaselineData.reduce((sum, item) => sum + item.total, 0);
  const comparisonTotal = currentComparisonData.reduce((sum, item) => sum + item.total, 0);
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
        <div className="flex items-center justify-between">
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="compare" className="flex-1 flex flex-col">
        <div className="border-b bg-card px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="delta">Delta Analysis</TabsTrigger>
          </TabsList>
        </div>

        {/* Compare Tab */}
        <TabsContent value="compare" className="flex-1 m-0 overflow-hidden flex flex-col">
          <div className="border-b bg-card p-4">
            {/* Version Selection Dropdowns */}
            <Card className="p-4 mb-4">
              <h3 className="text-sm font-medium mb-4">Select Versions for Comparison</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Baseline Version</label>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Comparison Version</label>
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
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
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
                {/* Header Section */}
                <div className="sticky top-0 bg-card border-b z-20">
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between mb-2">
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
                  
                  {/* Breadcrumb and Controls */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={activeView === 'csi' ? 'outline' : 'ghost'} 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setActiveView('csi')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          CSI
                        </Button>
                        <Button 
                          variant={activeView === 'spaces' ? 'outline' : 'ghost'} 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setActiveView('spaces')}
                        >
                          Spaces
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeView === 'csi' 
                        ? 'Uniformat → CSI → Bid Packages → Task line items. Click rows to expand.'
                        : 'Building → Levels → Spaces → CSI codes. Click rows to expand.'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="advanced-baseline" className="rounded" />
                      <label htmlFor="advanced-baseline" className="text-xs">Advanced Cost Controls</label>
                    </div>
                  </div>
                </div>

                <table className="w-full">
                  <thead className="sticky top-[180px] bg-muted/30 border-b text-xs z-10">
                    <tr>
                      <th className="text-left p-2 font-medium w-[40%]">CODE & DESCRIPTION<br/>ACTIONS</th>
                      <th className="text-left p-2 font-medium">BID PACKAGE</th>
                      <th className="text-center p-2 font-medium">QTY</th>
                      <th className="text-center p-2 font-medium">UNIT</th>
                      <th className="text-right p-2 font-medium">UNIT COST</th>
                      <th className="text-right p-2 font-medium">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderRows(currentBaselineData, expandedRowsBaseline, toggleRowBaseline, 0, true)}
                  </tbody>
                </table>

                {/* Bottom Section with Validation */}
                <div className="sticky bottom-0 bg-card border-t">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold">Project Total: {formatCurrency(baselineTotal)}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-muted-foreground">
                        Net Delta vs Baseline
                        <div className="font-bold text-green-600">+US$0</div>
                        <div>+0.00%</div>
                      </div>
                      <div className="text-xs">
                        <div className="mb-1">Validation Issues</div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">⊘ 0</span>
                          <span className="text-yellow-600">⚠ 31</span>
                          <span className="text-green-600">⊘ 0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Button size="sm" variant="outline" className="text-xs">Resolve All (31)</Button>
                      <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                        💾 Save Budget Updates
                      </Button>
                    </div>
                    
                    {/* Validation Warnings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Concrete Footings: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Foundation Walls: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Basement Slab: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-auto">
                {/* Header Section */}
                <div className="sticky top-0 bg-card border-b z-20">
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between mb-2">
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
                  
                  {/* Breadcrumb and Controls */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={activeView === 'csi' ? 'outline' : 'ghost'} 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setActiveView('csi')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          CSI
                        </Button>
                        <Button 
                          variant={activeView === 'spaces' ? 'outline' : 'ghost'} 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => setActiveView('spaces')}
                        >
                          Spaces
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activeView === 'csi' 
                        ? 'Uniformat → CSI → Bid Packages → Task line items. Click rows to expand.'
                        : 'Building → Levels → Spaces → CSI codes. Click rows to expand.'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="advanced-comparison" className="rounded" />
                      <label htmlFor="advanced-comparison" className="text-xs">Advanced Cost Controls</label>
                    </div>
                  </div>
                </div>

                <table className="w-full">
                  <thead className="sticky top-[180px] bg-muted/30 border-b text-xs z-10">
                    <tr>
                      <th className="text-left p-2 font-medium w-[40%]">CODE & DESCRIPTION<br/>ACTIONS</th>
                      <th className="text-left p-2 font-medium">BID PACKAGE</th>
                      <th className="text-center p-2 font-medium">QTY</th>
                      <th className="text-center p-2 font-medium">UNIT</th>
                      <th className="text-right p-2 font-medium">UNIT COST</th>
                      <th className="text-right p-2 font-medium">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderRows(currentComparisonData, expandedRowsComparison, toggleRowComparison, 0, false)}
                  </tbody>
                </table>

                {/* Bottom Section with Validation */}
                <div className="sticky bottom-0 bg-card border-t">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold">Project Total: {formatCurrency(comparisonTotal)}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-muted-foreground">
                        Net Delta vs Baseline
                        <div className={`font-bold ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {delta > 0 ? '+' : ''}{formatCurrency(Math.abs(delta))}
                        </div>
                        <div>{delta > 0 ? '+' : ''}{deltaPercent}%</div>
                      </div>
                      <div className="text-xs">
                        <div className="mb-1">Validation Issues</div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">⊘ 0</span>
                          <span className="text-yellow-600">⚠ 31</span>
                          <span className="text-green-600">⊘ 0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Button size="sm" variant="outline" className="text-xs">Resolve All (31)</Button>
                      <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                        💾 Save Budget Updates
                      </Button>
                    </div>
                    
                    {/* Validation Warnings */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Concrete Footings: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Foundation Walls: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Basement Slab: No cost source specified</span>
                          <span className="text-muted-foreground">· Assign cost source</span>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 text-xs">Fix</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Delta Analysis Tab */}
        <TabsContent value="delta" className="flex-1 m-0 overflow-auto px-6 pt-4 pb-6 space-y-6">
            {/* Version Selection */}
            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4">Select Versions for Delta Analysis</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Baseline Version</label>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Comparison Version</label>
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
                </div>
              </div>
            </Card>

            {/* AI Delta Summary */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">AI Delta Summary</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Total decrease of 3.6% (-1.47M) driven by manual changes (+2.7M). Top changes: Exterior Walls, Roofing, Elevators.
                  </p>
                </div>
              </div>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Total Delta */}
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Delta</div>
                <div className="text-3xl font-bold text-green-600 mb-1">-US$1,465,358</div>
                <div className="text-sm text-muted-foreground">-3.93%</div>
              </Card>

              {/* Changes by Type */}
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Changes by Type</div>
                <div className="flex items-center gap-4 text-2xl font-bold">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    <span>11</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <span>9</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>0</span>
                  </div>
                </div>
              </Card>

              {/* Line Changes */}
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Line Changes</div>
                <div className="text-3xl font-bold">20</div>
                <div className="text-sm text-muted-foreground">lines modified</div>
              </Card>
            </div>

            {/* Cost Drivers */}
            <div>
              <h3 className="text-sm font-medium mb-3">Cost Drivers</h3>
              <div className="grid grid-cols-5 gap-3">
                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <div className="text-center">
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Design</div>
                    <div className="text-xl font-bold text-blue-900 dark:text-blue-100">$0k</div>
                  </div>
                </Card>
                <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-purple-200">
                  <div className="text-center">
                    <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Policy</div>
                    <div className="text-xl font-bold text-purple-900 dark:text-purple-100">$0k</div>
                  </div>
                </Card>
                <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                  <div className="text-center">
                    <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Manual</div>
                    <div className="text-xl font-bold text-orange-900 dark:text-orange-100">$4778k</div>
                  </div>
                </Card>
                <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                  <div className="text-center">
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Risk</div>
                    <div className="text-xl font-bold text-yellow-900 dark:text-yellow-100">$0k</div>
                  </div>
                </Card>
                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200">
                  <div className="text-center">
                    <div className="text-sm text-green-700 dark:text-green-300 font-medium">Commercial</div>
                    <div className="text-xl font-bold text-green-900 dark:text-green-100">$0k</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Line-by-Line Changes Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium">Line-by-Line Changes</h3>
                  <p className="text-xs text-muted-foreground">Showing top 20 changes by absolute delta</p>
                </div>
              </div>
              
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b">
                      <tr className="text-xs">
                        <th className="text-left p-3 font-medium">Code</th>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-right p-3 font-medium">Old Value</th>
                        <th className="text-right p-3 font-medium">New Value</th>
                        <th className="text-right p-3 font-medium">Delta</th>
                        <th className="text-center p-3 font-medium">Driver</th>
                        <th className="text-center p-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { code: "B2010", desc: "Exterior Walls", oldValue: "$4,562,625", newValue: "$3,000,000", delta: "-1,562,625", driver: "Manual" },
                        { code: "B2020", desc: "Roofing", oldValue: "$2,828,827.5", newValue: "$1,992,217,567", delta: "+38,609,323", driver: "Manual" },
                        { code: "D1010", desc: "Elevators", oldValue: "$1,500,000", newValue: "$1,923,947,684", delta: "+423,347,684", driver: "Manual" },
                        { code: "B1020", desc: "Metal Decking", oldValue: "$775,646.25", newValue: "$510,000", delta: "-265,646.25", driver: "Manual" },
                        { code: "F2010", desc: "Demolition Work", oldValue: "$1,166,824", newValue: "$1,429,090,391", delta: "+262,266,391", driver: "Manual" },
                        { code: "D4010", desc: "Fire Sprinkler System", oldValue: "$1,341,230", newValue: "$1,587,119,072", delta: "+245,889,072", driver: "Manual" },
                        { code: "Z1010", desc: "General Conditions", oldValue: "$2,722,683", newValue: "$2,943,506.13", delta: "+220,863.13", driver: "Manual" },
                        { code: "C2010", desc: "Stair Construction", oldValue: "$2,105,663,771", newValue: "$2,282,631,786", delta: "+176,967,897", driver: "Manual" },
                        { code: "D2010", desc: "Plumbing Systems", oldValue: "$2,000,000", newValue: "$2,172,698,892", delta: "+172,698,892", driver: "Manual" },
                        { code: "CONT1010", desc: "Owner's Contingency", oldValue: "$2,526,780,819", newValue: "$2,381,042", delta: "-145,738,819", driver: "Manual" },
                        { code: "B1010", desc: "Structural Steel Frame", oldValue: "$361,968.25", newValue: "$238,000", delta: "-123,968.25", driver: "Manual" },
                        { code: "E2010", desc: "Office Furniture", oldValue: "$758,938", newValue: "$899,591,055", delta: "+110,853,055", driver: "Manual" },
                        { code: "C1010", desc: "Interior Partitions", oldValue: "$1,591,812", newValue: "$1,500,000", delta: "-91,812", driver: "Manual" },
                        { code: "A2010", desc: "Basement Slab", oldValue: "$902,947.5", newValue: "$948,059,828", delta: "+43,112,328", driver: "Manual" },
                        { code: "FTH1010", desc: "Construction Loan Interest", oldValue: "$1,904,834", newValue: "$1,967,478,271", delta: "+37,355,729", driver: "Manual" },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/20">
                          <td className="p-3 font-mono text-xs">{row.code}</td>
                          <td className="p-3">{row.desc}</td>
                          <td className="p-3 text-right">{row.oldValue}</td>
                          <td className="p-3 text-right">{row.newValue}</td>
                          <td className={`p-3 text-right font-semibold ${row.delta.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {row.delta}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                              {row.driver}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button className="hover:bg-muted rounded p-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </button>
                              <button className="hover:bg-muted rounded p-1">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
        </TabsContent>
      </Tabs>

      {/* Edit Recipe Dialog */}
      {editingItem && (
        <EditRecipeDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          itemCode={editingItem.code}
          itemDescription={editingItem.description}
        />
      )}
    </div>
  );
}

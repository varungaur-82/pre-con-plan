import { useState } from "react";
import { ChevronDown, ChevronRight, Edit2, Search, Eye } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EstimateItem {
  code: string;
  description: string;
  bidPackage: string;
  qty: string;
  unit: string;
  unitCost: string;
  total: number;
  subItems?: EstimateItem[];
  note?: string;
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

// Spaces-based data structure
const spacesData: EstimateItem[] = [
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
                  { code: "09 26 13", description: "Gypsum Board Walls", bidPackage: "Interior", qty: "1,250", unit: "SF", unitCost: "US$2.50", total: 3125 },
                  { code: "09 51 13", description: "Acoustical Ceiling", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "US$3.75", total: 9375 },
                  { code: "09 68 16", description: "Carpet Flooring", bidPackage: "Interior", qty: "2,500", unit: "SF", unitCost: "US$8.50", total: 21250 },
                  { code: "26 51 13", description: "Lighting Fixtures", bidPackage: "Electrical", qty: "25", unit: "EA", unitCost: "US$450.00", total: 11250 },
                  { code: "23 37 13", description: "Supply Air Diffusers", bidPackage: "HVAC", qty: "31.25", unit: "EA", unitCost: "US$325.00", total: 10156 },
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
              { code: "09 30 13", description: "Ceramic Tile Walls", bidPackage: "Interior", qty: "450", unit: "SF", unitCost: "US$12.50", total: 5625 },
              { code: "09 65 13", description: "Resilient Flooring", bidPackage: "Interior", qty: "350", unit: "SF", unitCost: "US$6.75", total: 2363 },
              { code: "22 41 13", description: "Plumbing Fixtures", bidPackage: "Plumbing", qty: "8", unit: "EA", unitCost: "US$875.00", total: 7000 },
              { code: "26 56 13", description: "Emergency Lighting", bidPackage: "Electrical", qty: "6", unit: "EA", unitCost: "US$325.50", total: 1953 },
              { code: "23 34 13", description: "Exhaust Fans", bidPackage: "HVAC", qty: "4", unit: "EA", unitCost: "US$249.75", total: 999 },
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
              { code: "09 30 23", description: "Stone Tile Flooring", bidPackage: "Interior", qty: "600", unit: "SF", unitCost: "US$35.00", total: 21000 },
              { code: "09 90 13", description: "Feature Wall Finish", bidPackage: "Interior", qty: "250", unit: "SF", unitCost: "US$38.00", total: 9500 },
              { code: "09 51 23", description: "Premium Acoustical Ceiling", bidPackage: "Interior", qty: "2,800", unit: "SF", unitCost: "US$5.25", total: 14700 },
              { code: "26 51 19", description: "LED Lighting Fixtures", bidPackage: "Electrical", qty: "30", unit: "EA", unitCost: "US$575.00", total: 17250 },
              { code: "12 48 13", description: "Custom Reception Desk", bidPackage: "Millwork", qty: "1", unit: "EA", unitCost: "US$17,265.00", total: 17265 },
            ],
          },
        ],
      },
      {
        code: "LEVEL7",
        description: "Level 7",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 66188,
        subItems: [
          {
            code: "Core",
            description: "Core",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 10887,
            subItems: [
              { code: "14 21 13", description: "Elevator Finishes", bidPackage: "Vertical Transport", qty: "2", unit: "EA", unitCost: "US$3,250.00", total: 6500 },
              { code: "10 14 13", description: "Signage", bidPackage: "Specialties", qty: "12", unit: "EA", unitCost: "US$365.58", total: 4387 },
            ],
          },
          {
            code: "Mechanical",
            description: "Mechanical Room",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 24801,
            subItems: [
              { code: "23 81 13", description: "HVAC Equipment", bidPackage: "HVAC", qty: "1", unit: "LS", unitCost: "US$18,500.00", total: 18500 },
              { code: "26 24 13", description: "Panel Boards", bidPackage: "Electrical", qty: "3", unit: "EA", unitCost: "US$2,100.33", total: 6301 },
            ],
          },
          {
            code: "Conference",
            description: "Conference Room",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 30500,
            subItems: [
              { code: "09 90 00", description: "Glass Partition Walls", bidPackage: "Interior", qty: "80", unit: "SF", unitCost: "US$95.00", total: 7600 },
              { code: "26 27 13", description: "Audio/Visual Systems", bidPackage: "Technology", qty: "1", unit: "LS", unitCost: "US$9,665.00", total: 9665 },
              { code: "09 68 26", description: "Premium Carpet Flooring", bidPackage: "Interior", qty: "600", unit: "SF", unitCost: "US$21.73", total: 13035 },
            ],
          },
        ],
      },
      {
        code: "LEVEL10",
        description: "Level 10",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 60700,
        subItems: [
          {
            code: "Executive",
            description: "Executive Suite",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 60700,
            subItems: [
              { code: "09 64 00", description: "Hardwood Flooring", bidPackage: "Interior", qty: "1,200", unit: "SF", unitCost: "US$28.50", total: 34200 },
              { code: "12 21 13", description: "Custom Millwork", bidPackage: "Furnishings", qty: "1", unit: "LS", unitCost: "US$26,500.00", total: 26500 },
            ],
          },
        ],
      },
      {
        code: "Basement",
        description: "Basement",
        bidPackage: "—",
        qty: "—",
        unit: "—",
        unitCost: "—",
        total: 38800,
        subItems: [
          {
            code: "LEVEL8",
            description: "Level 8",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 2722,
            subItems: [
              { code: "09 91 23", description: "Epoxy Floor Coating", bidPackage: "Interior", qty: "800", unit: "SF", unitCost: "US$3.40", total: 2722 },
            ],
          },
          {
            code: "Parking",
            description: "Parking Garage",
            bidPackage: "—",
            qty: "—",
            unit: "—",
            unitCost: "—",
            total: 36078,
            subItems: [
              { code: "03 30 00", description: "Concrete Topping", bidPackage: "Concrete", qty: "12,000", unit: "SF", unitCost: "US$2.15", total: 25800 },
              { code: "26 56 29", description: "Parking Garage Lighting", bidPackage: "Electrical", qty: "45", unit: "EA", unitCost: "US$228.40", total: 10278 },
            ],
          },
        ],
      },
    ],
  },
];

interface EstimateGeneratorProps {
  selectedDesignOption?: number;
}

export function EstimateGenerator({ selectedDesignOption = 2 }: EstimateGeneratorProps) {
  const [activeView, setActiveView] = useState<'csi' | 'spaces'>('csi');
  const [expandedRowsCSI, setExpandedRowsCSI] = useState<Set<string>>(new Set());
  const [expandedRowsSpaces, setExpandedRowsSpaces] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const expandedRows = activeView === 'csi' ? expandedRowsCSI : expandedRowsSpaces;
  const setExpandedRows = activeView === 'csi' ? setExpandedRowsCSI : setExpandedRowsSpaces;
  const currentData = activeView === 'csi' ? estimateData : spacesData;

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
    const allCodes = new Set<string>();
    const collectCodes = (items: EstimateItem[]) => {
      items.forEach(item => {
        allCodes.add(item.code);
        if (item.subItems) {
          collectCodes(item.subItems);
        }
      });
    };
    collectCodes(currentData);
    setExpandedRows(allCodes);
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const formatCurrency = (value: number) => {
    return `US$${value.toLocaleString()}`;
  };

  const totalProject = currentData.reduce((sum, item) => sum + item.total, 0);

  // Filter data based on search query
  const filterEstimateData = (items: EstimateItem[], query: string): EstimateItem[] => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.map(item => {
      const matchesCode = item.code.toLowerCase().includes(lowerQuery);
      const matchesDescription = item.description.toLowerCase().includes(lowerQuery);
      const matchesBidPackage = item.bidPackage.toLowerCase().includes(lowerQuery);
      
      if (matchesCode || matchesDescription || matchesBidPackage) {
        return item;
      }
      
      if (item.subItems) {
        const filteredSubItems = filterEstimateData(item.subItems, query);
        if (filteredSubItems.length > 0) {
          return { ...item, subItems: filteredSubItems };
        }
      }
      
      return null;
    }).filter((item): item is EstimateItem => item !== null);
  };

  const filteredData = filterEstimateData(currentData, searchQuery);

  // Recursive function to render rows
  const renderEstimateRow = (item: EstimateItem, level: number = 0): React.ReactNode => {
    const isExpanded = expandedRows.has(item.code);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    // Determine badge style based on level and view type
    const getBadgeVariant = () => {
      if (activeView === 'spaces') {
        // For spaces view: top 4 levels get blue badge
        return level <= 3 ? "secondary" : "outline";
      } else {
        // For CSI view: top level gets blue badge
        return level === 0 ? "secondary" : "outline";
      }
    };

    return (
      <>
        <tr key={item.code} className="border-b hover:bg-muted/30 transition-colors">
          <td className="p-3" style={{ paddingLeft: `${12 + level * 20}px` }}>
            <div className="flex items-center gap-2">
              {hasSubItems && (
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
              )}
              {!hasSubItems && <div className="w-6" />}
              <Badge variant={getBadgeVariant()} className="font-mono text-xs">
                {item.code}
              </Badge>
              <span className={level === 0 ? "font-medium" : "text-sm"}>{item.description}</span>
              {item.note && (
                <Badge variant="outline" className="text-xs text-green-600 bg-green-50 border-green-200">
                  {item.note}
                </Badge>
              )}
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
          <td className="p-3 text-muted-foreground text-sm">{item.bidPackage}</td>
          <td className="p-3 text-right text-muted-foreground text-sm">{item.qty}</td>
          <td className="p-3 text-right text-muted-foreground text-sm">{item.unit}</td>
          <td className="p-3 text-right text-muted-foreground text-sm">{item.unitCost}</td>
          <td className="p-3 text-right font-semibold">{formatCurrency(item.total)}</td>
        </tr>

        {/* Sub Items - rendered recursively */}
        {isExpanded && hasSubItems && item.subItems!.map(subItem => renderEstimateRow(subItem, level + 1))}
      </>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Estimated Budget - Option {selectedDesignOption}</h2>
            <p className="text-sm text-muted-foreground">Design Option {String.fromCharCode(64 + selectedDesignOption)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Budget: Delta Budget
            </Button>
            <Button variant="default" size="sm">
              Save Revision
            </Button>
            <select 
              className="px-3 py-1.5 border rounded-md text-sm bg-background cursor-pointer"
              defaultValue="current"
            >
              <option value="current">History</option>
              <option value="v10">Version 1.0 - Initial Estimate (Jan 2025)</option>
              <option value="v11">Version 1.1 - Scope Refinement (Feb 2025)</option>
              <option value="v12">Version 1.2 - Market Adjustment (Feb 2025)</option>
              <option value="v20">Version 2.0 - Design Development (Mar 2025)</option>
              <option value="v21">Version 2.1 - Value Engineering (Mar 2025)</option>
              <option value="v22">Version 2.2 - Code Compliance (Apr 2025)</option>
              <option value="v30">Version 3.0 - DD Submittal (May 2025)</option>
              <option value="v31">Version 3.1 - Client Revisions (Jun 2025)</option>
              <option value="v32">Version 3.2 - Final DD (Jul 2025)</option>
              <option value="v40">Version 4.0 - CD Phase (Aug 2025)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-medium">Master Estimate - Option {selectedDesignOption}</h3>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'csi' | 'spaces')}>
              <TabsList>
                <TabsTrigger value="csi">CSI</TabsTrigger>
                <TabsTrigger value="spaces">Spaces</TabsTrigger>
              </TabsList>
            </Tabs>
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => renderEstimateRow(item, 0))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No results found for "{searchQuery}"
                </td>
              </tr>
            )}

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

      {/* Edit Recipe Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Recipe</DialogTitle>
            <DialogDescription className="text-base">
              {editingItem?.code} - {editingItem?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Scope of Changes */}
            <div>
              <Label className="text-base font-medium mb-3 block">Scope of Changes</Label>
              <div className="flex gap-2">
                <Button variant="default" className="flex-1">
                  This Line
                </Button>
                <Button variant="outline" className="flex-1">
                  All Children (0 lines)
                </Button>
                <Button variant="outline" className="flex-1">
                  All Matching
                </Button>
              </div>
            </div>

            {/* Finish Tier */}
            <div>
              <Label className="text-base font-medium mb-3 block">Finish Tier</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Basic
                </Button>
                <Button variant="default" className="flex-1">
                  Standard
                </Button>
                <Button variant="outline" className="flex-1">
                  High
                </Button>
              </div>
            </div>

            {/* Source Type and City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Source Type</Label>
                <Select defaultValue="rsmeans">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rsmeans">RSMeans</SelectItem>
                    <SelectItem value="historical">Historical Data</SelectItem>
                    <SelectItem value="vendor">Vendor Quote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">City</Label>
                <Input defaultValue="NYC" />
              </div>
            </div>

            {/* Commercial Markups */}
            <div>
              <Label className="text-base font-medium mb-3 block">Commercial Markups (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>General Requirements</Label>
                  <Input type="number" defaultValue="8.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>OH&P / CM Fee</Label>
                  <Input type="number" defaultValue="10" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Bond & Insurance</Label>
                  <Input type="number" defaultValue="1.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Sales/Use Tax</Label>
                  <Input type="number" defaultValue="8.25" step="0.01" />
                </div>
              </div>
            </div>

            {/* Contingency */}
            <div>
              <Label className="text-base font-medium mb-3 block">Contingency</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select defaultValue="construction">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" defaultValue="12" step="0.1" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="allowance" />
                <label
                  htmlFor="allowance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allowance
                </label>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="lock-row" />
                  <label
                    htmlFor="lock-row"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lock Row
                  </label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Locked rows are protected from AI edits
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={() => setEditingItem(null)} className="gap-2">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

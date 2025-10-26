import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Search,
  Upload,
  LayoutGrid,
  List,
  FolderOpen,
  Eye,
  Link as LinkIcon,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  name: string;
  type: string;
  tags: string[];
  version: string;
  date: string;
  owner: string;
  folderPath?: string;
  status?: string;
}

interface PendingFileMapping {
  file: File;
  suggestedFolder: string;
  selectedFolder: string;
  fileType: string;
}

interface FolderItem extends FileItem {
  type: "Folder";
  files?: (FileItem | FolderItem)[];
}

const initialFolderData: FolderItem[] = [
  { 
    name: "Admin", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "15/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Contracts",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "08/01/2024",
        owner: "Legal Team",
        files: [
          { name: "Main_Contract_Agreement.pdf", type: "PDF", tags: ["contract", "agreement", "main"], version: "1.0", date: "08/01/2024", owner: "Legal Team" },
          { name: "Subcontractor_Agreements.pdf", type: "PDF", tags: ["contract", "subcontractor", "agreement"], version: "1.1", date: "09/01/2024", owner: "Legal Team", status: "pending" },
          { name: "Contract_Terms_Summary.docx", type: "Word Document", tags: ["contract", "summary"], version: "1.0", date: "08/01/2024", owner: "Legal Team" },
        ]
      },
      {
        name: "Permits",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "10/01/2024",
        owner: "Admin Team",
        files: [
          { name: "Building_Permit_Application.pdf", type: "PDF", tags: ["permit", "building"], version: "2.0", date: "10/01/2024", owner: "Admin Team" },
          { name: "Environmental_Permits.pdf", type: "PDF", tags: ["permit", "environmental"], version: "1.0", date: "11/01/2024", owner: "Admin Team" },
          { name: "Permit_Checklist.docx", type: "Word Document", tags: ["permit", "checklist"], version: "1.0", date: "10/01/2024", owner: "Admin Team" },
        ]
      }
    ] 
  },
  { 
    name: "Financials", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "14/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Budgets",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "12/01/2024",
        owner: "Finance Team",
        files: [
          { name: "Project_Master_Budget.pdf", type: "PDF", tags: ["budget", "master"], version: "3.2", date: "12/01/2024", owner: "Finance Team" },
          { name: "Monthly_Budget_Report.pdf", type: "PDF", tags: ["budget", "monthly"], version: "1.5", date: "15/01/2024", owner: "Finance Team" },
          { name: "Budget_Forecast_Q1.docx", type: "Word Document", tags: ["budget", "forecast"], version: "1.0", date: "13/01/2024", owner: "Finance Team" },
        ]
      },
      {
        name: "Invoices",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "16/01/2024",
        owner: "Finance Team",
        files: [
          { name: "Vendor_Invoice_2024_001.pdf", type: "PDF", tags: ["invoice", "vendor"], version: "1.0", date: "16/01/2024", owner: "Finance Team" },
          { name: "Subcontractor_Invoice_Summary.pdf", type: "PDF", tags: ["invoice", "subcontractor"], version: "1.0", date: "17/01/2024", owner: "Finance Team" },
          { name: "Invoice_Tracking_Log.docx", type: "Word Document", tags: ["invoice", "tracking"], version: "2.1", date: "16/01/2024", owner: "Finance Team" },
        ]
      }
    ] 
  },
  { 
    name: "Drawings", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "16/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Architectural",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "18/01/2024",
        owner: "Design Team",
        files: [
          { name: "Floor_Plans_Level_1.pdf", type: "PDF", tags: ["architectural", "floor plan"], version: "4.0", date: "18/01/2024", owner: "Design Team" },
          { name: "Elevation_Drawings_North.pdf", type: "PDF", tags: ["architectural", "elevation"], version: "3.5", date: "19/01/2024", owner: "Design Team" },
          { name: "Section_Details_A.docx", type: "Word Document", tags: ["architectural", "section"], version: "2.0", date: "18/01/2024", owner: "Design Team" },
        ]
      },
      {
        name: "Structural",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "20/01/2024",
        owner: "Engineering Team",
        files: [
          { name: "Foundation_Design.pdf", type: "PDF", tags: ["structural", "foundation"], version: "2.8", date: "20/01/2024", owner: "Engineering Team" },
          { name: "Steel_Frame_Details.pdf", type: "PDF", tags: ["structural", "steel"], version: "3.1", date: "21/01/2024", owner: "Engineering Team" },
          { name: "Load_Calculations.docx", type: "Word Document", tags: ["structural", "calculations"], version: "1.5", date: "20/01/2024", owner: "Engineering Team" },
        ]
      }
    ] 
  },
  { 
    name: "Reports", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "17/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Progress",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "22/01/2024",
        owner: "Project Manager",
        files: [
          { name: "Weekly_Progress_Report_W04.pdf", type: "PDF", tags: ["progress", "weekly"], version: "1.0", date: "22/01/2024", owner: "Project Manager" },
          { name: "Monthly_Progress_Summary.pdf", type: "PDF", tags: ["progress", "monthly"], version: "2.0", date: "25/01/2024", owner: "Project Manager" },
          { name: "Progress_Photos_January.docx", type: "Word Document", tags: ["progress", "photos"], version: "1.0", date: "23/01/2024", owner: "Project Manager" },
        ]
      },
      {
        name: "Quality",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "24/01/2024",
        owner: "QA Team",
        files: [
          { name: "Quality_Inspection_Report.pdf", type: "PDF", tags: ["quality", "inspection"], version: "1.2", date: "24/01/2024", owner: "QA Team" },
          { name: "Material_Testing_Results.pdf", type: "PDF", tags: ["quality", "testing"], version: "1.0", date: "26/01/2024", owner: "QA Team" },
          { name: "Non_Conformance_Report.docx", type: "Word Document", tags: ["quality", "ncr"], version: "1.1", date: "25/01/2024", owner: "QA Team" },
        ]
      }
    ] 
  },
  { 
    name: "Correspondence", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "18/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Emails",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "26/01/2024",
        owner: "Admin Team",
        files: [
          { name: "Client_Communication_Thread.pdf", type: "PDF", tags: ["email", "client"], version: "1.0", date: "26/01/2024", owner: "Admin Team" },
          { name: "Contractor_Email_Summary.pdf", type: "PDF", tags: ["email", "contractor"], version: "1.0", date: "27/01/2024", owner: "Admin Team" },
          { name: "Internal_Team_Updates.docx", type: "Word Document", tags: ["email", "internal"], version: "1.0", date: "26/01/2024", owner: "Admin Team" },
        ]
      },
      {
        name: "Letters",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "28/01/2024",
        owner: "Admin Team",
        files: [
          { name: "Formal_Notice_Letter.pdf", type: "PDF", tags: ["letter", "formal"], version: "1.0", date: "28/01/2024", owner: "Admin Team" },
          { name: "Award_Letter_Subcontractor.pdf", type: "PDF", tags: ["letter", "award"], version: "1.0", date: "29/01/2024", owner: "Admin Team" },
          { name: "Transmittal_Letter_Template.docx", type: "Word Document", tags: ["letter", "transmittal"], version: "2.0", date: "28/01/2024", owner: "Admin Team" },
        ]
      }
    ] 
  },
  { 
    name: "Contracts", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "19/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Agreements",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "30/01/2024",
        owner: "Legal Team",
        files: [
          { name: "Master_Service_Agreement.pdf", type: "PDF", tags: ["agreement", "master"], version: "2.0", date: "30/01/2024", owner: "Legal Team" },
          { name: "Non_Disclosure_Agreement.pdf", type: "PDF", tags: ["agreement", "nda"], version: "1.0", date: "31/01/2024", owner: "Legal Team" },
          { name: "Partnership_Agreement.docx", type: "Word Document", tags: ["agreement", "partnership"], version: "1.5", date: "30/01/2024", owner: "Legal Team" },
        ]
      },
      {
        name: "Legal Documents",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "01/02/2024",
        owner: "Legal Team",
        files: [
          { name: "Legal_Opinion_Letter.pdf", type: "PDF", tags: ["legal", "opinion"], version: "1.0", date: "01/02/2024", owner: "Legal Team" },
          { name: "Liability_Waiver_Forms.pdf", type: "PDF", tags: ["legal", "waiver"], version: "1.0", date: "02/02/2024", owner: "Legal Team" },
          { name: "Insurance_Requirements.docx", type: "Word Document", tags: ["legal", "insurance"], version: "1.2", date: "01/02/2024", owner: "Legal Team" },
        ]
      }
    ] 
  },
  { 
    name: "Schedules", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "20/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Project Schedules",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "03/02/2024",
        owner: "Project Manager",
        files: [
          { name: "Master_Project_Schedule.pdf", type: "PDF", tags: ["schedule", "master"], version: "5.0", date: "03/02/2024", owner: "Project Manager" },
          { name: "Phase_1_Construction_Schedule.pdf", type: "PDF", tags: ["schedule", "phase 1"], version: "3.2", date: "04/02/2024", owner: "Project Manager" },
          { name: "Updated_Timeline_Q1.docx", type: "Word Document", tags: ["schedule", "timeline"], version: "2.1", date: "03/02/2024", owner: "Project Manager" },
        ]
      },
      {
        name: "Milestones",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "05/02/2024",
        owner: "Project Manager",
        files: [
          { name: "Key_Milestones_Tracker.pdf", type: "PDF", tags: ["milestone", "tracker"], version: "2.5", date: "05/02/2024", owner: "Project Manager" },
          { name: "Milestone_Achievement_Report.pdf", type: "PDF", tags: ["milestone", "report"], version: "1.0", date: "06/02/2024", owner: "Project Manager" },
          { name: "Critical_Path_Analysis.docx", type: "Word Document", tags: ["milestone", "critical path"], version: "1.3", date: "05/02/2024", owner: "Project Manager" },
        ]
      }
    ] 
  },
  { 
    name: "Procurement", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "21/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Purchase Orders",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "07/02/2024",
        owner: "Procurement Team",
        files: [
          { name: "PO_2024_001_Steel_Materials.pdf", type: "PDF", tags: ["purchase order", "steel"], version: "1.0", date: "07/02/2024", owner: "Procurement Team" },
          { name: "PO_2024_002_Concrete_Supply.pdf", type: "PDF", tags: ["purchase order", "concrete"], version: "1.0", date: "08/02/2024", owner: "Procurement Team" },
          { name: "Purchase_Order_Log.docx", type: "Word Document", tags: ["purchase order", "log"], version: "3.0", date: "07/02/2024", owner: "Procurement Team" },
        ]
      },
      {
        name: "Supplier Documents",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "09/02/2024",
        owner: "Procurement Team",
        files: [
          { name: "Supplier_Qualification_Package.pdf", type: "PDF", tags: ["supplier", "qualification"], version: "1.5", date: "09/02/2024", owner: "Procurement Team" },
          { name: "Material_Certificates.pdf", type: "PDF", tags: ["supplier", "certificates"], version: "1.0", date: "10/02/2024", owner: "Procurement Team" },
          { name: "Vendor_Performance_Review.docx", type: "Word Document", tags: ["supplier", "performance"], version: "2.0", date: "09/02/2024", owner: "Procurement Team" },
        ]
      }
    ] 
  },
  { 
    name: "Closeout", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "22/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Final Reports",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "11/02/2024",
        owner: "Project Manager",
        files: [
          { name: "Project_Completion_Report.pdf", type: "PDF", tags: ["final", "completion"], version: "1.0", date: "11/02/2024", owner: "Project Manager" },
          { name: "Lessons_Learned_Summary.pdf", type: "PDF", tags: ["final", "lessons learned"], version: "1.0", date: "12/02/2024", owner: "Project Manager" },
          { name: "Final_Cost_Report.docx", type: "Word Document", tags: ["final", "cost"], version: "1.0", date: "11/02/2024", owner: "Project Manager" },
        ]
      },
      {
        name: "Warranties",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "13/02/2024",
        owner: "Admin Team",
        files: [
          { name: "Equipment_Warranty_Documentation.pdf", type: "PDF", tags: ["warranty", "equipment"], version: "1.0", date: "13/02/2024", owner: "Admin Team" },
          { name: "Contractor_Warranty_Certificate.pdf", type: "PDF", tags: ["warranty", "contractor"], version: "1.0", date: "14/02/2024", owner: "Admin Team" },
          { name: "Warranty_Registry.docx", type: "Word Document", tags: ["warranty", "registry"], version: "1.0", date: "13/02/2024", owner: "Admin Team" },
        ]
      }
    ] 
  },
  { 
    name: "Change Management", 
    type: "Folder", 
    tags: ["folder"], 
    version: "–", 
    date: "23/01/2024", 
    owner: "System", 
    files: [
      {
        name: "Change Orders",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "15/02/2024",
        owner: "Project Manager",
        files: [
          { name: "Change_Order_001_Design_Revision.pdf", type: "PDF", tags: ["change order", "design"], version: "1.0", date: "15/02/2024", owner: "Project Manager" },
          { name: "Change_Order_002_Scope_Addition.pdf", type: "PDF", tags: ["change order", "scope"], version: "1.0", date: "16/02/2024", owner: "Project Manager" },
          { name: "Change_Order_Log.docx", type: "Word Document", tags: ["change order", "log"], version: "4.2", date: "15/02/2024", owner: "Project Manager" },
        ]
      },
      {
        name: "Variations",
        type: "Folder",
        tags: ["subfolder"],
        version: "–",
        date: "17/02/2024",
        owner: "Project Manager",
        files: [
          { name: "Variation_Request_Form.pdf", type: "PDF", tags: ["variation", "request"], version: "1.0", date: "17/02/2024", owner: "Project Manager" },
          { name: "Approved_Variations_Summary.pdf", type: "PDF", tags: ["variation", "approved"], version: "2.0", date: "18/02/2024", owner: "Project Manager" },
          { name: "Variation_Impact_Analysis.docx", type: "Word Document", tags: ["variation", "analysis"], version: "1.1", date: "17/02/2024", owner: "Project Manager" },
        ]
      }
    ] 
  },
];

const sidebarFolders = [
  "Admin",
  "Financials",
  "Drawings",
  "Reports",
  "Correspondence",
  "Contracts",
  "Schedules",
  "Procurement",
  "Closeout",
  "Change Management",
];

const missingFiles = [
  {
    title: "Site Survey",
    description: "Topographic & boundary survey missing",
    type: "warning",
  },
  {
    title: "MEP Drawings",
    description: "Mechanical, Electrical, Plumbing plans",
    type: "error",
  },
  {
    title: "Structural Analysis",
    description: "Load calculations & foundation design",
    type: "warning",
  },
  {
    title: "Code Compliance",
    description: "Building code review & compliance docs",
    type: "info",
  },
  {
    title: "Cost Estimates",
    description: "Detailed preconstruction cost analysis",
    type: "info",
  },
];

const recentFiles = [
  { title: "Updated 1h ago", file: "Architectural_Floor_Plan_v4.1.dwg" },
  { title: "Added 3h ago", file: "Site_Utility_Plan.pdf" },
  { title: "Modified 6h ago", file: "Preconstruction_Cost_Estimate.xlsx" },
  { title: "Uploaded 1d ago", file: "Structural_Load_Analysis.pdf" },
  { title: "Updated 2d ago", file: "MEP_Coordination_Drawings.dwg" },
  { title: "Added 3d ago", file: "Design_Review_Checklist.docx" },
];

export function DataEngine() {
  const [expandedFolder, setExpandedFolder] = useState(true);
  const [aiSmart, setAiSmart] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [folderData, setFolderData] = useState<FolderItem[]>(initialFolderData);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [pendingMappings, setPendingMappings] = useState<PendingFileMapping[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Build folder structure including subfolders
  const folderOptions: Array<{ value: string; label: string; isSubfolder: boolean }> = [];
  initialFolderData.forEach(folder => {
    // Add main folder
    folderOptions.push({ value: folder.name, label: folder.name, isSubfolder: false });
    // Add subfolders
    if (folder.files) {
      folder.files.forEach(item => {
        if (item.type === "Folder") {
          folderOptions.push({
            value: `${folder.name}/${item.name}`,
            label: `${folder.name} > ${item.name}`,
            isSubfolder: true
          });
        }
      });
    }
  });

  // Enhanced AI mapping logic with broader pattern matching to specific subfolders
  const mapFileToFolder = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // Admin subfolders
    if (lowerName.includes('contract') || lowerName.includes('agreement') || 
        lowerName.includes('terms') || lowerName.includes('nda')) {
      return 'Admin/Contracts';
    }
    if (lowerName.includes('permit') || lowerName.includes('license') || 
        lowerName.includes('approval')) {
      return 'Admin/Permits';
    }

    // Financials subfolders
    if (lowerName.includes('budget') || lowerName.includes('forecast')) {
      return 'Financials/Budgets';
    }
    if (lowerName.includes('invoice') || lowerName.includes('billing') || 
        lowerName.includes('payment')) {
      return 'Financials/Invoices';
    }

    // Drawings subfolders
    if (lowerName.includes('architectural') || lowerName.includes('floor') || 
        lowerName.includes('elevation') || lowerName.includes('section')) {
      return 'Drawings/Architectural';
    }
    if (lowerName.includes('structural') || lowerName.includes('foundation') || 
        lowerName.includes('steel') || lowerName.includes('load')) {
      return 'Drawings/Structural';
    }

    // Reports subfolders
    if (lowerName.includes('progress') || lowerName.includes('weekly') || 
        lowerName.includes('monthly') || lowerName.includes('status')) {
      return 'Reports/Progress';
    }
    if (lowerName.includes('quality') || lowerName.includes('inspection') || 
        lowerName.includes('testing') || lowerName.includes('ncr')) {
      return 'Reports/Quality';
    }

    // Correspondence subfolders
    if (lowerName.includes('email') || lowerName.includes('message') || 
        extension === 'msg' || extension === 'eml') {
      return 'Correspondence/Emails';
    }
    if (lowerName.includes('letter') || lowerName.includes('formal') || 
        lowerName.includes('transmittal')) {
      return 'Correspondence/Letters';
    }

    // Contracts subfolders
    if (lowerName.includes('agreement') && !lowerName.includes('contract')) {
      return 'Contracts/Agreements';
    }
    if (lowerName.includes('legal') || lowerName.includes('liability') || 
        lowerName.includes('insurance') && !lowerName.includes('contract')) {
      return 'Contracts/Legal Documents';
    }

    // Schedules subfolders
    if (lowerName.includes('schedule') || lowerName.includes('timeline') || 
        lowerName.includes('gantt')) {
      return 'Schedules/Project Schedules';
    }
    if (lowerName.includes('milestone') || lowerName.includes('critical path')) {
      return 'Schedules/Milestones';
    }

    // Procurement subfolders
    if (lowerName.includes('purchase') || lowerName.includes('po') || 
        lowerName.includes('order')) {
      return 'Procurement/Purchase Orders';
    }
    if (lowerName.includes('supplier') || lowerName.includes('vendor') || 
        lowerName.includes('certificate')) {
      return 'Procurement/Supplier Documents';
    }

    // Closeout subfolders
    if (lowerName.includes('final') || lowerName.includes('completion') || 
        lowerName.includes('closeout')) {
      return 'Closeout/Final Reports';
    }
    if (lowerName.includes('warrant') || lowerName.includes('guarantee')) {
      return 'Closeout/Warranties';
    }

    // Change Management subfolders
    if (lowerName.includes('change order') || lowerName.includes('co_')) {
      return 'Change Management/Change Orders';
    }
    if (lowerName.includes('variation') || lowerName.includes('rfi') || 
        lowerName.includes('modification')) {
      return 'Change Management/Variations';
    }

    // Fallback to main folders based on file type
    if (extension === 'pdf') return 'Reports';
    if (extension === 'xlsx' || extension === 'xls') return 'Financials';
    if (extension === 'docx' || extension === 'doc') return 'Correspondence';
    if (extension === 'dwg' || extension === 'dxf') return 'Drawings';

    // Default to Admin
    return 'Admin';
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      'pdf': 'PDF Document',
      'dwg': 'CAD Drawing',
      'dxf': 'CAD Drawing',
      'xlsx': 'Excel Spreadsheet',
      'xls': 'Excel Spreadsheet',
      'csv': 'CSV Data',
      'docx': 'Word Document',
      'doc': 'Word Document',
      'pptx': 'PowerPoint',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'mpp': 'Project Schedule',
    };
    return typeMap[extension] || 'Document';
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const filesArray = Array.from(files);

    toast({
      title: "Processing files...",
      description: `AI is analyzing and mapping ${filesArray.length} file(s) to appropriate folders.`,
    });

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create pending mappings
    const mappings: PendingFileMapping[] = filesArray.map(file => {
      const suggestedFolder = aiSmart ? mapFileToFolder(file.name) : 'Admin';
      return {
        file,
        suggestedFolder,
        selectedFolder: suggestedFolder,
        fileType: getFileType(file.name),
      };
    });

    setPendingMappings(mappings);
    setIsProcessing(false);
    setShowMappingDialog(true);
  };

  const handleConfirmMapping = () => {
    const newFolderData = [...folderData];
    const currentDate = new Date().toLocaleDateString('en-GB');

    pendingMappings.forEach(mapping => {
      const folderPath = mapping.selectedFolder.split('/');
      const mainFolderName = folderPath[0];
      const subfolderName = folderPath[1];

      const folderIndex = newFolderData.findIndex(f => f.name === mainFolderName);

      if (folderIndex !== -1) {
        const newFile: FileItem = {
          name: mapping.file.name,
          type: mapping.fileType,
          tags: [mainFolderName.toLowerCase().replace(/ /g, '-')],
          version: 'v1.0',
          date: currentDate,
          owner: 'You',
          folderPath: mapping.selectedFolder,
        };

        // If subfolder is specified, add to subfolder
        if (subfolderName) {
          const subfolder = newFolderData[folderIndex].files?.find(
            item => item.type === "Folder" && item.name === subfolderName
          ) as FolderItem | undefined;

          if (subfolder) {
            if (!subfolder.files) {
              subfolder.files = [];
            }
            subfolder.files.push(newFile);
            // Auto-expand both main folder and subfolder
            setExpandedFolders(prev => {
              const newSet = new Set(prev);
              newSet.add(mainFolderName);
              newSet.add(`${mainFolderName}/${subfolderName}`);
              return newSet;
            });
          }
        } else {
          // Add to main folder
          if (!newFolderData[folderIndex].files) {
            newFolderData[folderIndex].files = [];
          }
          newFolderData[folderIndex].files!.push(newFile);
          // Auto-expand the main folder
          setExpandedFolders(prev => new Set(prev).add(mainFolderName));
        }
      }
    });

    setFolderData(newFolderData);
    setShowMappingDialog(false);
    setPendingMappings([]);

    toast({
      title: "Files successfully mapped!",
      description: `${pendingMappings.length} file(s) have been categorized and added to your repository.`,
    });
  };

  const updateMapping = (index: number, newFolder: string) => {
    setPendingMappings(prev => 
      prev.map((mapping, i) => 
        i === index ? { ...mapping, selectedFolder: newFolder } : mapping
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const toggleFolderExpansion = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* AI Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI File Mapping Review
            </DialogTitle>
            <DialogDescription>
              Review and adjust the AI-suggested folder mappings for your uploaded files.
              {aiSmart && " AI Smart mode has automatically categorized files based on their names and types."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-3">
              {pendingMappings.map((mapping, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{mapping.file.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {mapping.fileType}
                      </Badge>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {aiSmart && mapping.suggestedFolder !== mapping.selectedFolder && (
                        <div className="text-xs text-muted-foreground">
                          <span className="line-through">{mapping.suggestedFolder}</span>
                        </div>
                      )}
                      <Select
                        value={mapping.selectedFolder}
                        onValueChange={(value) => updateMapping(index, value)}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {folderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Folder className={`h-4 w-4 ${option.isSubfolder ? 'text-blue-400' : 'text-blue-500'}`} />
                                <span className={option.isSubfolder ? 'text-sm' : 'font-medium'}>
                                  {option.label}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {aiSmart && mapping.selectedFolder === mapping.suggestedFolder && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <Sparkles className="h-3 w-3" />
                      AI suggested: {mapping.suggestedFolder}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmMapping}>
              Confirm & Add {pendingMappings.length} File{pendingMappings.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-muted/30 border-r overflow-y-auto">
        {/* File Explorer */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">File Explorer</h3>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              Expand All
            </Button>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground mb-2">Data Repository</div>
            <div className="ml-2">
              <button
                onClick={() => setExpandedFolder(!expandedFolder)}
                className="flex items-center gap-2 w-full text-sm hover:bg-muted/50 rounded p-1"
              >
                {expandedFolder ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <Folder className="h-4 w-4 text-blue-500" />
                <span>Data Repository</span>
              </button>

              {expandedFolder && (
                <div className="ml-4 mt-1 space-y-1">
                  {folderData.map((folder) => {
                    const fileCount = folder.files?.length || 0;
                    const isFolderExpanded = expandedFolders.has(folder.name);
                    return (
                      <div key={folder.name}>
                        <button
                          className="flex items-center gap-2 w-full text-sm hover:bg-muted/50 rounded p-1"
                          onClick={() => toggleFolderExpansion(folder.name)}
                        >
                          {isFolderExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <Folder className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{folder.name}</span>
                          {fileCount > 0 && (
                            <Badge variant="secondary" className="ml-auto h-4 px-1 text-xs">
                              {fileCount}
                            </Badge>
                          )}
                        </button>
                        {isFolderExpanded && folder.files && (
                          <div className="ml-6 mt-1 space-y-1">
                            {folder.files.map((item) => {
                              if (item.type === "Folder") {
                                const subfolder = item as FolderItem;
                                const subfolderFileCount = subfolder.files?.length || 0;
                                return (
                                  <button
                                    key={subfolder.name}
                                    className="flex items-center gap-2 w-full text-xs hover:bg-muted/50 rounded p-1"
                                    onClick={() => toggleFolderExpansion(`${folder.name}/${subfolder.name}`)}
                                  >
                                    <Folder className="h-3 w-3 text-blue-400" />
                                    <span>{subfolder.name}</span>
                                    {subfolderFileCount > 0 && (
                                      <Badge variant="secondary" className="ml-auto h-3 px-1 text-[10px]">
                                        {subfolderFileCount}
                                      </Badge>
                                    )}
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Missing Design Files */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold text-sm text-orange-500">Missing Design Files</h3>
          </div>
          <div className="space-y-2">
            {missingFiles.map((file, idx) => (
              <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-start gap-2">
                  <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{file.title}</div>
                    <div className="text-muted-foreground text-xs">{file.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Design Files */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <h3 className="font-semibold text-sm text-green-600">Recent Design Files</h3>
          </div>
          <div className="space-y-2">
            {recentFiles.map((file, idx) => (
              <div key={idx} className="p-2 bg-green-50 rounded text-xs">
                <div className="flex items-start gap-2">
                  <FileText className="h-3 w-3 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-green-600 font-medium">{file.title}</div>
                    <div className="text-muted-foreground text-xs">{file.file}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files semantically... (e.g., 'Find all structural drawings after Jan 2024')"
              className="pl-10"
            />
          </div>
        </div>

        {/* Data Repository Contents */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Data Repository Contents</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button variant="default" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">NAME</TableHead>
                    <TableHead className="w-[150px]">TYPE</TableHead>
                    <TableHead className="w-[150px]">TAGS</TableHead>
                    <TableHead className="w-[120px]">VERSION</TableHead>
                    <TableHead className="w-[150px]">DATE</TableHead>
                    <TableHead className="w-[120px]">OWNER</TableHead>
                    <TableHead className="w-[100px]">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {folderData.map((folder) => {
                    const isExpanded = expandedFolders.has(folder.name);
                    return (
                      <>
                        <TableRow key={folder.name} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => toggleFolderExpansion(folder.name)}
                                className="hover:bg-muted/50 rounded p-0.5"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <FolderOpen className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{folder.name}</span>
                              {folder.files && folder.files.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {folder.files.length}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{folder.type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {folder.tags[0]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{folder.version}</TableCell>
                          <TableCell>{folder.date}</TableCell>
                          <TableCell>{folder.owner}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && folder.files?.map((item) => {
                          // Check if item is a subfolder
                          if (item.type === "Folder") {
                            const subfolder = item as FolderItem;
                            const isSubfolderExpanded = expandedFolders.has(`${folder.name}/${subfolder.name}`);
                            return (
                              <>
                                <TableRow key={`${folder.name}-${subfolder.name}`} className="bg-muted/20">
                                  <TableCell className="pl-12">
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => toggleFolderExpansion(`${folder.name}/${subfolder.name}`)}
                                        className="hover:bg-muted/50 rounded p-0.5"
                                      >
                                        {isSubfolderExpanded ? (
                                          <ChevronDown className="h-3 w-3" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3" />
                                        )}
                                      </button>
                                      <Folder className="h-4 w-4 text-blue-500" />
                                      <span className="font-medium">{subfolder.name}</span>
                                      {subfolder.files && subfolder.files.length > 0 && (
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                          {subfolder.files.length}
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{subfolder.type}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                      {subfolder.tags[0]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{subfolder.version}</TableCell>
                                  <TableCell>{subfolder.date}</TableCell>
                                  <TableCell>{subfolder.owner}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {isSubfolderExpanded && subfolder.files?.map((file) => (
                                  <TableRow key={`${folder.name}-${subfolder.name}-${file.name}`} className="bg-muted/30">
                                    <TableCell className="pl-24">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{file.name}</span>
                                        {file.status === "pending" && (
                                          <AlertTriangle className="h-3 w-3 text-orange-500 ml-1" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>{file.type}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-1 flex-wrap">
                                        {file.tags.slice(0, 2).map((tag, idx) => (
                                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{file.version}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell>{file.owner}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            );
                          } else {
                            // It's a file
                            const file = item as FileItem;
                            return (
                              <TableRow key={`${folder.name}-${file.name}`} className="bg-muted/20">
                                <TableCell className="pl-12">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{file.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{file.type}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {file.tags[0]}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{file.version}</TableCell>
                                <TableCell>{file.date}</TableCell>
                                <TableCell>{file.owner}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Smart Repository */}
        <div className="p-6 border-t bg-muted/20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">Smart Repository</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Manual</span>
                <Switch checked={aiSmart} onCheckedChange={setAiSmart} />
                <span className="text-sm font-medium text-blue-600">AI Smart</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Your AI-powered file management hub. Upload files, search semantically, and let AI automatically classify, tag, and organize your project data.
            </p>

            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 bg-background hover:border-primary/50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <Upload className={`h-12 w-12 mb-4 ${isProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                <h3 className="text-lg font-semibold mb-2">
                  {isProcessing ? 'Processing Files...' : 'Drag & Drop Files'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {aiSmart 
                    ? 'AI Smart mode is ON - Files will be automatically classified and organized into the appropriate folders.'
                    : 'Manual mode is ON - All files will be placed in the Admin folder.'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Choose Files'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

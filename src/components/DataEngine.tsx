import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
}

interface FolderItem extends FileItem {
  type: "Folder";
  files?: FileItem[];
}

const initialFolderData: FolderItem[] = [
  { name: "Admin", type: "Folder", tags: ["folder"], version: "–", date: "15/01/2024", owner: "System", files: [] },
  { name: "Financials", type: "Folder", tags: ["folder"], version: "–", date: "14/01/2024", owner: "System", files: [] },
  { name: "Drawings", type: "Folder", tags: ["folder"], version: "–", date: "16/01/2024", owner: "System", files: [] },
  { name: "Reports", type: "Folder", tags: ["folder"], version: "–", date: "17/01/2024", owner: "System", files: [] },
  { name: "Correspondence", type: "Folder", tags: ["folder"], version: "–", date: "18/01/2024", owner: "System", files: [] },
  { name: "Contracts & Legal", type: "Folder", tags: ["folder"], version: "–", date: "19/01/2024", owner: "System", files: [] },
  { name: "Schedules", type: "Folder", tags: ["folder"], version: "–", date: "20/01/2024", owner: "System", files: [] },
  { name: "Procurement", type: "Folder", tags: ["folder"], version: "–", date: "21/01/2024", owner: "System", files: [] },
  { name: "Closeout", type: "Folder", tags: ["folder"], version: "–", date: "22/01/2024", owner: "System", files: [] },
  { name: "Change Management", type: "Folder", tags: ["folder"], version: "–", date: "23/01/2024", owner: "System", files: [] },
];

const sidebarFolders = [
  "Admin",
  "Financials",
  "Drawings",
  "Reports",
  "Correspondence",
  "Contracts & Legal",
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // AI mapping logic based on file name and type
  const mapFileToFolder = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // Drawings - CAD, DWG, PDF drawings, architectural files
    if (extension === 'dwg' || extension === 'dxf' || lowerName.includes('drawing') || 
        lowerName.includes('plan') || lowerName.includes('architectural') || 
        lowerName.includes('mep') || lowerName.includes('structural')) {
      return 'Drawings';
    }

    // Financials - Excel, CSV, budget files
    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv' || 
        lowerName.includes('budget') || lowerName.includes('cost') || 
        lowerName.includes('invoice') || lowerName.includes('payment') ||
        lowerName.includes('financial')) {
      return 'Financials';
    }

    // Reports - PDF reports, analysis documents
    if (extension === 'pdf' && (lowerName.includes('report') || lowerName.includes('analysis') || 
        lowerName.includes('summary') || lowerName.includes('review'))) {
      return 'Reports';
    }

    // Contracts & Legal - Legal documents, agreements
    if (lowerName.includes('contract') || lowerName.includes('agreement') || 
        lowerName.includes('legal') || lowerName.includes('nda') ||
        lowerName.includes('terms')) {
      return 'Contracts & Legal';
    }

    // Schedules - Schedule files, timelines
    if (lowerName.includes('schedule') || lowerName.includes('timeline') || 
        lowerName.includes('gantt') || extension === 'mpp') {
      return 'Schedules';
    }

    // Correspondence - Emails, letters, memos
    if (lowerName.includes('email') || lowerName.includes('letter') || 
        lowerName.includes('memo') || lowerName.includes('correspondence')) {
      return 'Correspondence';
    }

    // Procurement - Purchase orders, RFQs, vendor docs
    if (lowerName.includes('purchase') || lowerName.includes('procurement') || 
        lowerName.includes('rfq') || lowerName.includes('vendor') ||
        lowerName.includes('supplier')) {
      return 'Procurement';
    }

    // Closeout - Closeout documents, warranties, manuals
    if (lowerName.includes('closeout') || lowerName.includes('warranty') || 
        lowerName.includes('manual') || lowerName.includes('commissioning')) {
      return 'Closeout';
    }

    // Change Management - Change orders, RFIs
    if (lowerName.includes('change') || lowerName.includes('rfi') || 
        lowerName.includes('modification')) {
      return 'Change Management';
    }

    // Default to Admin for misc files
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

    const newFolderData = [...folderData];
    const currentDate = new Date().toLocaleDateString('en-GB');

    filesArray.forEach(file => {
      const targetFolder = aiSmart ? mapFileToFolder(file.name) : 'Admin';
      const folderIndex = newFolderData.findIndex(f => f.name === targetFolder);

      if (folderIndex !== -1) {
        const newFile: FileItem = {
          name: file.name,
          type: getFileType(file.name),
          tags: [targetFolder.toLowerCase().replace(/ /g, '-')],
          version: 'v1.0',
          date: currentDate,
          owner: 'You',
          folderPath: targetFolder,
        };

        if (!newFolderData[folderIndex].files) {
          newFolderData[folderIndex].files = [];
        }
        newFolderData[folderIndex].files!.push(newFile);

        // Auto-expand the folder
        setExpandedFolders(prev => new Set(prev).add(targetFolder));
      }
    });

    setFolderData(newFolderData);
    setIsProcessing(false);

    toast({
      title: "Files successfully mapped!",
      description: `${filesArray.length} file(s) have been intelligently categorized and added to your repository.`,
    });
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
                    return (
                      <button
                        key={folder.name}
                        className="flex items-center gap-2 w-full text-sm hover:bg-muted/50 rounded p-1"
                        onClick={() => toggleFolderExpansion(folder.name)}
                      >
                        {expandedFolders.has(folder.name) ? (
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
                        {isExpanded && folder.files?.map((file) => (
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
                        ))}
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
  );
}

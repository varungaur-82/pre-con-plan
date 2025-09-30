import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTabContext } from "@/contexts/TabContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, Check, CheckCircle2, Send, Paperclip, FolderOpen, Search, Download, Save, X, ChevronRight, ChevronDown, Folder } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, name: "Import Files" },
  { id: 2, name: "Project Charter & Vision" },
  { id: 3, name: "Project Repo" },
  { id: 4, name: "Review & Confirm" },
];


export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const navigate = useNavigate();
  const { openTab } = useTabContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [visibleFields, setVisibleFields] = useState<number[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [promptResponses, setPromptResponses] = useState<{ [key: number]: string }>({});
  const [aiResponses, setAiResponses] = useState<{ [key: number]: string }>({});
  const [isGenerating, setIsGenerating] = useState<{ [key: number]: boolean }>({});
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const step2FileInputRef = useRef<HTMLInputElement>(null);
  const step3FileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [transparentConfirmation, setTransparentConfirmation] = useState(true);
  const [suggestionAccepted, setSuggestionAccepted] = useState<boolean | null>(null);
  const [placementAccepted, setPlacementAccepted] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({
    Design: true,
  });
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creationStep, setCreationStep] = useState<string>("");
  const [creationProgress, setCreationProgress] = useState(0);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const [formData, setFormData] = useState({
    projectId: "PRJ-2025-001",
    projectName: "NYC Tower",
    designStage: "Schematic Design",
    client: "NYC Health",
    projectType: "Healthcare",
    location: "New York City, NY",
    budget: "$2.5M",
    completion: "Q4 2025",
    visionStatement: "To create a state-of-the-art healthcare facility that sets new standards in patient care and medical innovation for New York City. The NYC Tower will integrate cutting-edge medical technology with sustainable design principles, providing a healing environment that serves the community while supporting the healthcare professionals who work within its walls.",
    objectives: "1. Complete construction by Q4 2025 within the $2.5M budget\n2. Achieve LEED Gold certification for sustainable healthcare design\n3. Deliver 120,000 sq ft of modern medical infrastructure across 18 floors\n4. Ensure compliance with all NYC DOB and Health Department regulations\n5. Create flexible spaces that can adapt to evolving medical technologies\n6. Maximize natural light and optimize patient room layouts for improved healing outcomes",
    keyMetrics: "• Budget Performance: Track actual vs. planned spend weekly, maintain variance within ±3%\n• Schedule Adherence: Monitor milestone completion rates, target 100% on-time delivery\n• Quality Metrics: Zero safety incidents, 98% first-time quality acceptance rate\n• Sustainability: Energy efficiency targets (30% below baseline), LEED points tracking\n• Stakeholder Satisfaction: Monthly surveys with client, design team, and contractors (target >4.5/5)",
    stakeholders: "• Owner/Developer: NYC Health - Primary decision-maker and financier\n• Project Management Team: Overall coordination and delivery\n• Architect & Design Team: Building design and technical specifications\n• General Contractor: Main construction execution\n• Specialized Subcontractors: MEP, structural, facade, interior fit-out specialists\n• Local Authorities: NYC DOB, Health Department, Fire Marshal",
    risks: "• Regulatory Delays: Permit approval timeline uncertainty\n• Budget Overruns: Material cost fluctuations in current market\n• Schedule Constraints: Weather-related delays during construction\n• Supply Chain Issues: Long lead times for specialized medical equipment\n• Stakeholder Coordination: Multiple approval layers may slow decision-making",
    successCriteria: "• Project completed on time and within budget\n• All regulatory approvals obtained without major delays\n• LEED Gold certification achieved\n• Client satisfaction score above 4.5/5\n• Zero major safety incidents during construction\n• Successful commissioning of all medical systems\n• Smooth handover and operational readiness",
  });


  const quickPrompts = [
    { id: 1, text: "Help me define the vision", field: "visionStatement" },
    { id: 2, text: "Help me define the objective", field: "objectives" },
    { id: 3, text: "Suggest Key metrics", field: "keyMetrics" },
    { id: 4, text: "Help me define project objectives for a residential development", field: "objectives" },
    { id: 5, text: "What stakeholders should I include for a commercial build?", field: "stakeholders" },
  ];

  const extractedData = [
    { label: "Project Title / Name", value: "NYC Tower", field: "projectName" },
    { label: "Client / Owner Details", value: "NYC Health", field: "client" },
    { label: "Project Location & Site Address", value: "New York City, NY", field: "location" },
    { label: "Plot Size / Area Statement", value: "120,000 sq ft", field: null },
    { label: "Zoning / Land Use Classification", value: "Healthcare", field: "projectType" },
    { label: "Building Type & Usage", value: "Healthcare Facility", field: null },
    { label: "Number of Floors / Storeys", value: "18", field: null },
    { label: "Key Dates", value: "Start: 2025-01-01, Completion: 2025-12-31", field: null },
    { label: "Permits & Approvals Required", value: "NYC DOB, Health Dept", field: null },
    { label: "Estimated Project Cost / Budget", value: "$2.5M", field: null },
    { label: "Stakeholders", value: "Architect, Contractor, Consultants, PMC", field: null },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateExtraction();
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const simulateExtraction = () => {
    setIsExtracting(true);
    setExtractionProgress(0);
    setVisibleFields([]);
    setShowSuccessMessage(false);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Animate fields appearing one by one
    extractedData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFields((prev) => [...prev, index]);
      }, 500 + index * 400);
    });

    // Close dialog after 5 seconds and trigger confetti
    setTimeout(() => {
      setIsExtracting(false);
      setExtractionProgress(0);
      setVisibleFields([]);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Populate form fields
      setFormData({
        projectId: "PRJ-2025-001",
        projectName: "NYC Tower",
        designStage: "Schematic Design",
        client: "NYC Health",
        projectType: "Healthcare",
        location: "New York City, NY",
        budget: "$2.5M",
        completion: "Q4 2025",
        visionStatement: "",
        objectives: "",
        keyMetrics: "",
        stakeholders: "",
        risks: "",
        successCriteria: "",
      });

      // Show success message
      setShowSuccessMessage(true);
      toast({
        title: "Fields Updated Successfully!",
        description: "AI has extracted and populated the project information from your documents.",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }, 5000);
  };

  const aiResponseTemplates: { [key: number]: string } = {
    1: "Based on your NYC Tower project, here's a recommended vision statement:\n\n'To create a state-of-the-art healthcare facility that sets new standards in patient care and medical innovation for New York City. The NYC Tower will integrate cutting-edge medical technology with sustainable design principles, providing a healing environment that serves the community while supporting the healthcare professionals who work within its walls. This facility will become a beacon of excellence in healthcare infrastructure, demonstrating how thoughtful design and advanced medical capabilities can come together to improve patient outcomes and operational efficiency.'",
    2: "For the NYC Tower healthcare facility, here are key objectives:\n\n1. Complete construction by Q4 2025 within the $2.5M budget\n2. Achieve LEED Gold certification for sustainable healthcare design\n3. Deliver 120,000 sq ft of modern medical infrastructure across 18 floors\n4. Ensure compliance with all NYC DOB and Health Department regulations\n5. Create flexible spaces that can adapt to evolving medical technologies\n6. Maximize natural light and optimize patient room layouts for improved healing outcomes\n7. Implement smart building systems for energy efficiency and operational cost reduction",
    3: "Key performance metrics for tracking project success:\n\n• Budget Performance: Track actual vs. planned spend weekly, maintain variance within ±3%\n• Schedule Adherence: Monitor milestone completion rates, target 100% on-time delivery\n• Quality Metrics: Zero safety incidents, 98% first-time quality acceptance rate\n• Sustainability: Energy efficiency targets (30% below baseline), LEED points tracking\n• Stakeholder Satisfaction: Monthly surveys with client, design team, and contractors (target >4.5/5)\n• Compliance: 100% permit approval rate, zero regulatory violations\n• Change Orders: Limit to <5% of total project value\n• RFI Response Time: Average response within 48 hours",
    4: "For a residential development project, key objectives typically include:\n\n1. Deliver high-quality, market-appropriate housing units that meet target demographic needs\n2. Achieve project completion within approved timeline and budget constraints\n3. Maximize livable space efficiency while maintaining aesthetic appeal\n4. Ensure compliance with local zoning, building codes, and residential standards\n5. Implement sustainable building practices (energy efficiency, water conservation)\n6. Create attractive common areas and amenities that enhance resident lifestyle\n7. Maintain strong relationships with local community and address neighborhood concerns\n8. Optimize unit mix based on market research and pre-sales data\n9. Achieve target sales velocity and pricing objectives",
    5: "Essential stakeholders for a commercial construction project:\n\n• Owner/Developer: Primary decision-maker and financier\n• Project Management Team: Overall coordination and delivery\n• Architect & Design Team: Building design and technical specifications\n• General Contractor: Main construction execution\n• Specialized Subcontractors: MEP, structural, facade, interior fit-out specialists\n• Civil Engineers: Site work, utilities, grading\n• Local Authorities: Building department, fire marshal, zoning board\n• Landlord/Property Manager: If on leased land or existing property\n• Tenants/End Users: Input on space requirements and functionality\n• Lenders/Financial Partners: Funding and budget oversight\n• Legal Counsel: Contract review and regulatory compliance\n• Insurance Providers: Risk management and coverage\n• Utility Companies: Power, water, gas, telecommunications connections"
  };

  const handlePromptClick = (promptId: number) => {
    if (activePrompt === promptId) {
      setActivePrompt(null);
      return;
    }
    
    setActivePrompt(promptId);
    
    // Only generate if we don't have a response yet
    if (!aiResponses[promptId]) {
      setIsGenerating({ ...isGenerating, [promptId]: true });
      
      // Simulate AI generation delay
      setTimeout(() => {
        setAiResponses({ ...aiResponses, [promptId]: aiResponseTemplates[promptId] || "AI response generated successfully." });
        setIsGenerating({ ...isGenerating, [promptId]: false });
      }, 1500);
    }
  };

  const handlePromptResponse = (promptId: number, value: string) => {
    setPromptResponses({ ...promptResponses, [promptId]: value });
  };

  const handlePopulate = (promptId: number) => {
    const prompt = quickPrompts.find(p => p.id === promptId);
    const response = aiResponses[promptId];
    
    if (prompt && response && prompt.field) {
      setFormData({ ...formData, [prompt.field]: response });
      toast({
        title: "Field Populated",
        description: "AI response has been added to the form field.",
      });
      setActivePrompt(null);
    }
  };

  const handleStep2FileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleCreateProject = () => {
    setIsCreatingProject(true);
    setCreationProgress(0);

    const steps = [
      { text: "Extracting information from documents...", duration: 1000 },
      { text: "Setting up project context...", duration: 1200 },
      { text: "Fetching information from AI models...", duration: 1300 },
      { text: "Finalizing project setup...", duration: 500 }
    ];

    let totalDuration = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCreationStep(step.text);
        setCreationProgress(((index + 1) / steps.length) * 100);
      }, totalDuration);
      totalDuration += step.duration;
    });

    // Complete the process after all steps
    setTimeout(() => {
      setIsCreatingProject(false);
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      // Show success toast
      toast({
        title: "Project Created Successfully!",
        description: `${formData.projectName} has been created and is ready to use.`,
      });

      // Close modal
      onOpenChange(false);

      // Open the new project tab
      setTimeout(() => {
        openTab(formData.projectId, formData.projectName, `/project/${formData.projectId}`);
      }, 300);
    }, totalDuration);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] flex flex-col p-0 bg-white">
          <DialogHeader className="px-6 pt-4 pb-2 border-b">
            {/* Minimal Stepper */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors",
                        currentStep > step.id
                          ? "bg-blue-600 text-white"
                          : currentStep === step.id
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] whitespace-nowrap",
                        currentStep >= step.id
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-colors",
                        currentStep > step.id ? "bg-blue-600" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50/30">
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Success Message */}
              {showSuccessMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-800 font-medium">
                    Fields have been updated with extracted information from your documents!
                  </p>
                </div>
              )}

              {/* AI Head Start Section */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">Let AI give you a head start</h3>
                    <p className="text-xs text-muted-foreground">
                      Drop files and I'll extract the project name, client, location, and current stage. You'll review before saving.
                    </p>
                  </div>
                </div>
              </div>

            {/* Drop Zone */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              multiple
            />
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground">
                  Contracts, SOWs (PDF/DOCX)
                </p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                onClick={handleChooseFiles}
              >
                <Upload className="mr-2 h-3 w-3" />
                Choose files
              </Button>
            </div>

            {/* Project Information Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Project Information (editable)</h3>

              <div className="space-y-3">
                {/* Project ID */}
                <div className="space-y-1">
                  <Label htmlFor="projectId" className="text-xs">
                    Project ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectId"
                    placeholder="Project ID"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.projectId && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>

                {/* Project Name */}
                <div className="space-y-1">
                  <Label htmlFor="projectName" className="text-xs">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Project Name"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.projectName && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>

                {/* Design Stage */}
                <div className="space-y-1">
                  <Label htmlFor="designStage" className="text-xs">Design Stage</Label>
                  <Input
                    id="designStage"
                    placeholder="Design Stage"
                    value={formData.designStage}
                    onChange={(e) => setFormData({ ...formData, designStage: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.designStage && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>

                {/* Client */}
                <div className="space-y-1">
                  <Label htmlFor="client" className="text-xs">
                    Client <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client"
                    placeholder="Client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.client && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>

                {/* Project Type */}
                <div className="space-y-1">
                  <Label htmlFor="projectType" className="text-xs">Project Type</Label>
                  <Input
                    id="projectType"
                    placeholder="Healthcare"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.projectType && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-xs">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-muted/30 h-8 text-xs"
                  />
                  {formData.location && (
                    <p className="text-[10px] text-muted-foreground">
                      Extracted from uploaded docs source: contract.pdf
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                AI suggestions are based on your imported files. You can adjust anytime.
              </p>
            </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left Column - AI Assistant with Separate Scroll */}
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col bg-muted/30 rounded-lg overflow-hidden">
                  {/* Compact Header */}
                  <div className="flex items-center gap-2 p-3 border-b bg-white/50">
                    <div>
                      <h3 className="text-sm font-semibold">AI Vision Assistant</h3>
                      <p className="text-[10px] text-muted-foreground">Smart project charter generation</p>
                    </div>
                  </div>

                  {/* Scrollable Chat Area */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Quick prompts:</p>
                    {quickPrompts.map((prompt) => (
                      <div 
                        key={prompt.id}
                        className="space-y-2"
                      >
                        <button
                          onClick={() => handlePromptClick(prompt.id)}
                          className={cn(
                            "w-full text-left text-xs rounded-md px-3 py-2 transition-colors",
                            activePrompt === prompt.id 
                              ? "bg-blue-600 text-white" 
                              : "text-blue-600 hover:bg-blue-50"
                          )}
                        >
                          {prompt.text}
                        </button>
                        
                        {/* AI Response */}
                        {activePrompt === prompt.id && (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                            {isGenerating[prompt.id] ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent" />
                                <span>Generating response...</span>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold text-[10px]">AI</span>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                    {aiResponses[prompt.id]}
                                  </p>
                                </div>
                                <div className="flex justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => handlePopulate(prompt.id)}
                                    className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                                  >
                                    Populate
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Fixed Message Input at Bottom */}
                  <div className="p-3 border-t bg-white/80">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your message..."
                        className="min-h-[60px] text-xs"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            ref={step2FileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleStep2FileSelect}
                            multiple
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => step2FileInputRef.current?.click()}
                          >
                            <Paperclip className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                          {uploadedFiles.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {uploadedFiles.length} file(s)
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700">
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Contracts, SOWs (PDF, DOCX). AI can make mistakes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Project Charter Form */}
              <div className="bg-blue-50/50 rounded-lg p-5 space-y-4">
                <h3 className="text-base font-bold text-blue-600 mb-4">Project Charter</h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Project Name</span>
                    <p className="font-medium">{formData.projectName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Project ID</span>
                    <p className="font-medium">{formData.projectId || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Client</span>
                    <p className="font-medium">{formData.client || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">{formData.location || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium">{formData.projectType || "—"}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="visionStatement" className="text-xs font-semibold">
                      Vision Statement
                    </Label>
                    <Textarea
                      id="visionStatement"
                      placeholder="Enter vision statement"
                      value={formData.visionStatement}
                      onChange={(e) => setFormData({ ...formData, visionStatement: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="objectives" className="text-xs font-semibold">
                      Objectives
                    </Label>
                    <Textarea
                      id="objectives"
                      placeholder="Enter objectives"
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="keyMetrics" className="text-xs font-semibold">
                      Key Metrics
                    </Label>
                    <Textarea
                      id="keyMetrics"
                      placeholder="Enter key metrics"
                      value={formData.keyMetrics}
                      onChange={(e) => setFormData({ ...formData, keyMetrics: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="stakeholders" className="text-xs font-semibold">
                      Stakeholders
                    </Label>
                    <Textarea
                      id="stakeholders"
                      placeholder="Enter stakeholders"
                      value={formData.stakeholders}
                      onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="risks" className="text-xs font-semibold">
                      Risks
                    </Label>
                    <Textarea
                      id="risks"
                      placeholder="Enter risks"
                      value={formData.risks}
                      onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="successCriteria" className="text-xs font-semibold">
                      Success Criteria
                    </Label>
                    <Textarea
                      id="successCriteria"
                      placeholder="Enter success criteria"
                      value={formData.successCriteria}
                      onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="budget" className="text-xs font-semibold">
                        Budget
                      </Label>
                      <Input
                        id="budget"
                        placeholder="Enter budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="completion" className="text-xs font-semibold">
                        Completion
                      </Label>
                      <Input
                        id="completion"
                        placeholder="Enter completion date"
                        value={formData.completion}
                        onChange={(e) => setFormData({ ...formData, completion: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">Welcome to Project Repository</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enterprise baseline is ready. I'll classify files and propose folders. You control confirmations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Transparent Confirmation</span>
                  <Switch
                    checked={transparentConfirmation}
                    onCheckedChange={setTransparentConfirmation}
                  />
                </div>
              </div>

              {/* Main Content - Two Columns */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Repository Assistant */}
                <div className="space-y-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <FolderOpen className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold">Repository Assistant</h3>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Welcome to your Project Repository. I'll classify files and suggest folders. Transparent confirmation is ON by default.
                    </p>

                    {/* Suggestion Message */}
                    <div className="bg-blue-100/50 rounded-md p-3 space-y-2">
                      <p className="text-xs font-medium">I suggest locations for 4 file(s). Accept to place them.</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => setSuggestionAccepted(true)}
                          disabled={suggestionAccepted !== null}
                        >
                          {suggestionAccepted === true && <Check className="mr-1 h-3 w-3" />}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setSuggestionAccepted(false)}
                          disabled={suggestionAccepted !== null}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>

                    {/* Placement Message */}
                    <div className="bg-blue-100/50 rounded-md p-3 space-y-2">
                      <p className="text-xs font-medium">Proposed placements for 4 file(s).</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                          onClick={() => setPlacementAccepted(true)}
                          disabled={placementAccepted !== null}
                        >
                          {placementAccepted === true && <Check className="mr-1 h-3 w-3" />}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setPlacementAccepted(false)}
                          disabled={placementAccepted !== null}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center space-y-3">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Drag & drop files here</p>
                      <p className="text-xs text-muted-foreground">
                        Contracts, drawings, schedules, spreadsheets
                      </p>
                    </div>
                    <input
                      ref={step3FileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          toast({
                            title: "Files Uploaded",
                            description: `${e.target.files.length} file(s) ready for classification.`,
                          });
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => step3FileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-3 w-3" />
                      Choose files
                    </Button>
                  </div>
                </div>

                {/* Right Column - Repository Structure */}
                <div className="space-y-4">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Repository Structure</h3>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search folders/files"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-7 text-xs pl-7 w-48 bg-white"
                        />
                      </div>
                    </div>

                    {/* Folder List */}
                    <div className="space-y-2">
                      {[
                        { name: "Contracts", tag: "enterprise" },
                        { name: "Drawings", tag: "enterprise" },
                        { name: "Schedules", tag: "enterprise" },
                        { name: "Permits", tag: "enterprise" },
                        { name: "Correspondence", tag: "enterprise" },
                      ].map((folder) => (
                        <div
                          key={folder.name}
                          className="flex items-center justify-between py-2 px-3 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">{folder.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {folder.tag}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setSuggestionAccepted(null);
                          setPlacementAccepted(null);
                        }}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Dismiss placements
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-black hover:bg-gray-800"
                        onClick={() => {
                          setSuggestionAccepted(true);
                          setPlacementAccepted(true);
                          toast({
                            title: "All Placements Accepted",
                            description: "Files have been organized into folders.",
                          });
                        }}
                      >
                        Accept all placements
                      </Button>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Folder Tree Structure at Bottom */}
              <div className="mt-6 border-t pt-4">
                <div className="space-y-1">
                  {/* Design Folder */}
                  <div>
                    <button
                      onClick={() => toggleFolder("Design")}
                      className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded w-full text-left"
                    >
                      {expandedFolders.Design ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Design</span>
                    </button>
                    {expandedFolders.Design && (
                      <div className="ml-6 space-y-1 mt-1">
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Feasibility Studies</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Compliance Reports</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Test Fits</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Procurement Folder */}
                  <div>
                    <button
                      onClick={() => toggleFolder("Procurement")}
                      className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded w-full text-left"
                    >
                      {expandedFolders.Procurement ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Procurement</span>
                    </button>
                    {expandedFolders.Procurement && (
                      <div className="ml-6 space-y-1 mt-1">
                        <div className="flex items-center gap-2 px-2 py-1">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Contracts</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Folder */}
                  <div>
                    <button
                      onClick={() => toggleFolder("Admin")}
                      className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded w-full text-left"
                    >
                      {expandedFolders.Admin ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Admin</span>
                    </button>
                    {expandedFolders.Admin && (
                      <div className="ml-6 space-y-1 mt-1">
                        {/* Add subfolders here if needed */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Review & Confirm</h2>
                <p className="text-sm text-muted-foreground">
                  Please review all project details before creating your project
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Project Information */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</div>
                      Project Information
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Project ID</span>
                          <p className="font-semibold text-sm">{formData.projectId || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Project Name</span>
                          <p className="font-semibold text-sm">{formData.projectName || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Client</span>
                          <p className="font-semibold text-sm">{formData.client || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Location</span>
                          <p className="font-semibold text-sm">{formData.location || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Project Type</span>
                          <p className="font-semibold text-sm">{formData.projectType || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Design Stage</span>
                          <p className="font-semibold text-sm">{formData.designStage || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vision Statement */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Vision Statement</h4>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-xs text-gray-800 leading-relaxed">
                        {formData.visionStatement || <span className="text-muted-foreground italic">No vision statement provided</span>}
                      </p>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Objectives</h4>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {formData.objectives || <span className="text-muted-foreground italic">No objectives provided</span>}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Key Metrics</h4>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {formData.keyMetrics || <span className="text-muted-foreground italic">No key metrics provided</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Project Charter */}
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-bold text-green-600 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">2</div>
                      Project Charter & Vision
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Budget</span>
                          <p className="font-semibold text-sm">{formData.budget || "Not set"}</p>
                        </div>
                        <div className="bg-white/50 p-2 rounded">
                          <span className="text-muted-foreground font-medium block mb-1">Completion</span>
                          <p className="font-semibold text-sm">{formData.completion || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stakeholders */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Stakeholders</h4>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {formData.stakeholders || <span className="text-muted-foreground italic">No stakeholders defined</span>}
                      </p>
                    </div>
                  </div>

                  {/* Risks */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Risks</h4>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {formData.risks || <span className="text-muted-foreground italic">No risks identified</span>}
                      </p>
                    </div>
                  </div>

                  {/* Success Criteria */}
                  <div className="bg-gray-50 border rounded-lg p-4 space-y-2">
                    <h4 className="text-xs font-bold text-gray-700">Success Criteria</h4>
                    <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                        {formData.successCriteria || <span className="text-muted-foreground italic">No success criteria defined</span>}
                      </p>
                    </div>
                  </div>

                  {/* Repository Structure */}
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</div>
                      Project Repository
                    </h3>
                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground">Enterprise folders created:</p>
                      <ul className="space-y-1 pl-4">
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                          Contracts
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                          Drawings
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                          Schedules
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                          Permits
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                          Correspondence
                        </li>
                      </ul>
                      <p className="text-muted-foreground pt-2">Custom folder structure: Design, Procurement, Admin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="confirm" className="text-xs text-gray-700">
                    <span className="font-semibold">I confirm that all information is correct</span>
                    <span className="block mt-1 text-muted-foreground">
                      By checking this box, you acknowledge that you have reviewed all project details and are ready to create the project. This will initialize the project repository and set up your workspace.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Sticky Footer */}
          <div className="border-t bg-background p-4">
            <div className="flex justify-end gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} className="h-8 text-xs">
                  Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                  Save & Continue
                </Button>
              ) : (
                <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                  Create Project
                </Button>
              )}
            </div>
          </div>
      </DialogContent>
    </Dialog>

    {/* Extraction Dialog */}
    <Dialog open={isExtracting} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Extracting information from the document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={extractionProgress} className="h-2" />

          <div className="space-y-3">
            {extractedData.map((field, index) => (
              <div
                key={index}
                className={cn(
                  "flex justify-between items-center py-2 border-b transition-all duration-300",
                  visibleFields.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <span className="text-sm font-medium text-blue-600">
                  {field.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Project Creation Progress Dialog */}
    <Dialog open={isCreatingProject} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Creating Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={creationProgress} className="h-2" />
          
          <div className="flex items-center gap-3 py-3">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <p className="text-sm text-muted-foreground">{creationStep}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}

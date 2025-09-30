import { useState, useRef, useEffect } from "react";
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
import { Upload, Check, CheckCircle2, Send, Paperclip } from "lucide-react";
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
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    designStage: "",
    client: "",
    projectType: "",
    location: "",
    budget: "",
    completion: "",
    visionStatement: "",
    objectives: "",
    keyMetrics: "",
  });


  const quickPrompts = [
    { id: 1, text: "Help me define the vision", field: "visionStatement" },
    { id: 2, text: "Help me define the objective", field: "objectives" },
    { id: 3, text: "Suggest Key metrics", field: "keyMetrics" },
    { id: 4, text: "Help me define project objectives for a residential development", field: "objectives" },
    { id: 5, text: "What stakeholders should I include for a commercial build?", field: "objectives" },
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6">
          <DialogHeader>
            {/* Stepper */}
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                        currentStep > step.id
                          ? "bg-blue-600 text-white"
                          : currentStep === step.id
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-1 text-center",
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
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - AI Assistant */}
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">AI</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">AI Vision Assistant</h3>
                      <p className="text-xs text-muted-foreground">Smart project charter generation</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Quick prompts:</p>
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
                </div>

                {/* Message Input */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[80px] text-xs resize-none"
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
                        Upload File
                      </Button>
                      {uploadedFiles.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {uploadedFiles.length} file(s) uploaded
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Contracts, SOWs (PDF, DOCX). NewCon AI can make mistakes. Verify important information.
                  </p>
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
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium">{formData.projectType || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget</span>
                    <p className="font-medium">{formData.budget || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Completion</span>
                    <p className="font-medium">{formData.completion || "—"}</p>
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
                      className="min-h-[60px] text-xs resize-none bg-white"
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
                      className="min-h-[60px] text-xs resize-none bg-white"
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
                      className="min-h-[60px] text-xs resize-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Project Repo step content goes here
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-8 text-center text-muted-foreground text-xs">
              Review & Confirm step content goes here
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
                <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs">
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
  </>
  );
}

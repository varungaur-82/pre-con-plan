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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, Check, CheckCircle2 } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    designStage: "",
    client: "",
    projectType: "",
    location: "",
  });

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
            <div className="py-8 text-center text-muted-foreground text-xs">
              Project Charter & Vision step content goes here
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

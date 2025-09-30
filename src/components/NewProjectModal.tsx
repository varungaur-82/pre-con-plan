import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

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

const sourceLinks = [
  "OneDrive",
  "Box",
  "Google Drive",
  "Local Folder",
  "Autodesk Construction Cloud",
  "Procore",
  "PlanGrid",
];

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-muted-foreground">
            Step {currentStep} — {steps[currentStep - 1].name}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-6">
            {/* AI Head Start Section */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Let AI give you a head start</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect a source or drop files. I'll extract the project name, client, location, and current stage. You'll review before saving.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sourceLinks.map((source) => (
                      <button
                        key={source}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground">
                  Contracts, drawings (PDF/DWG/IFC), schedules, spreadsheets
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" />
                Choose files
              </Button>
            </div>

            {/* Project Information Form */}
            <div className="space-y-6">
              <h3 className="font-semibold">Project Information (editable)</h3>

              <div className="space-y-4">
                {/* Project ID */}
                <div className="space-y-2">
                  <Label htmlFor="projectId">
                    Project ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectId"
                    placeholder="Project ID"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>

                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="projectName">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Project Name"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>

                {/* Design Stage */}
                <div className="space-y-2">
                  <Label htmlFor="designStage">Design Stage</Label>
                  <Input
                    id="designStage"
                    placeholder="Design Stage"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label htmlFor="client">
                    Client <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client"
                    placeholder="Client"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Input
                    id="projectType"
                    placeholder="Healthcare"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Location"
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Extracted from uploaded docs source: contract.pdf
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                AI suggestions are based on your imported files. You can adjust anytime.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="py-12 text-center text-muted-foreground">
            Project Charter & Vision step content goes here
          </div>
        )}

        {currentStep === 3 && (
          <div className="py-12 text-center text-muted-foreground">
            Project Repo step content goes here
          </div>
        )}

        {currentStep === 4 && (
          <div className="py-12 text-center text-muted-foreground">
            Review & Confirm step content goes here
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Save & Continue
            </Button>
          ) : (
            <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700">
              Create Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

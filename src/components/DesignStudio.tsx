import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Upload, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { id: "overview", label: "Design Overview" },
  { id: "alignment", label: "Review Site Alignment" },
  { id: "cost", label: "Generate Cost" },
  { id: "schedule", label: "Build Schedule" },
  { id: "presentation", label: "Client Presentation" },
];

const initialDesignOptions = [
  { 
    id: 1, 
    title: "Option 1",
    view: "2D",
    codeCompliant: true,
    cost: "$33.8M",
    schedule: "13 mo",
    gfa: "120k sf",
    sustainability: "92%"
  },
  { 
    id: 2, 
    title: "Option 2",
    view: "2D",
    codeCompliant: true,
    cost: "$35.2M",
    schedule: "14 mo",
    gfa: "125k sf",
    sustainability: "88%"
  },
  { 
    id: 3, 
    title: "Option 3",
    view: "2D",
    codeCompliant: false,
    cost: "$31.5M",
    schedule: "12 mo",
    gfa: "115k sf",
    sustainability: "95%"
  },
];

export function DesignStudio() {
  const [activeMenuItem, setActiveMenuItem] = useState("overview");
  const [aiQuery, setAiQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [designOptions, setDesignOptions] = useState<typeof initialDesignOptions>([]);
  const [expandedOption, setExpandedOption] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<{[key: number]: string}>({});
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleGenerateOptions = () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a design file first.",
        variant: "destructive",
      });
      return;
    }

    setDesignOptions(initialDesignOptions);
    setExpandedOption(1);
    toast({
      title: "Options Generated",
      description: `Generated ${initialDesignOptions.length} design options.`,
    });
  };

  const toggleOption = (optionId: number) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  const handleViewChange = (optionId: number, view: string) => {
    setViewMode({ ...viewMode, [optionId]: view });
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background">
      {/* Left Sidebar */}
      <div className="w-64 bg-card border-r p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenuItem(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeMenuItem === item.id
                ? "bg-construction-success/10 text-construction-success border border-construction-success/20"
                : "hover:bg-muted text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Upload Band */}
        <div className="border-b bg-card px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Upload a design (DWG, IFC, PDF, DXF, RVT) to start.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => document.getElementById('design-file-input')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Design
              </Button>
              <Button 
                onClick={handleGenerateOptions}
                className="bg-construction-success hover:bg-construction-success/90"
                disabled={!uploadedFile}
              >
                Generate Options
              </Button>
              <input
                id="design-file-input"
                type="file"
                accept=".dwg,.ifc,.pdf,.dxf,.rvt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Design Studio
            </h1>
            <p className="text-muted-foreground mb-8">
              Main AI Screen — project-level insights, status, and interactions...
            </p>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="border-construction-success text-construction-success hover:bg-construction-success/10"
              >
                Compliance Summary
              </Button>
              <Button 
                variant="outline"
                className="border-construction-success text-construction-success hover:bg-construction-success/10"
              >
                Vision Alignment Summary
              </Button>
              <Button 
                variant="outline"
                className="border-construction-success text-construction-success hover:bg-construction-success/10"
              >
                Design Comparison Summary
              </Button>
            </div>
          </div>
        </div>

        {/* AI Assistant Bottom Bar */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-foreground mb-2">AI Assistant</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Summarize risks and suggest mitigations"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="shrink-0">
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="shrink-0 bg-construction-success hover:bg-construction-success/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Design Options */}
      <div className="w-96 bg-card border-l overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Design Options</h2>
          <Button variant="ghost" size="icon">
            →
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {designOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Upload a design and generate options to see them here.
            </p>
          ) : (
            designOptions.map((option) => (
              <Collapsible 
                key={option.id}
                open={expandedOption === option.id}
                onOpenChange={() => toggleOption(option.id)}
              >
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <h3 className="text-lg font-semibold text-foreground">
                        {option.title}
                      </h3>
                      {expandedOption === option.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4">
                      {/* View Selector */}
                      <div>
                        <p className="text-sm font-medium mb-2">View:</p>
                        <div className="flex gap-2">
                          {["2D", "3D", "Render"].map((view) => (
                            <button
                              key={view}
                              onClick={() => handleViewChange(option.id, view)}
                              className={`px-3 py-1.5 text-sm rounded ${
                                (viewMode[option.id] || option.view) === view
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                              }`}
                            >
                              {(viewMode[option.id] || option.view) === view && "✓ "}
                              {view}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Design Preview */}
                      <div className="bg-muted rounded border p-4 h-32 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {viewMode[option.id] || option.view} View Preview
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        {option.codeCompliant && (
                          <div className="flex items-center gap-2 text-construction-success">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">100% Code Compliant</span>
                          </div>
                        )}
                        <p className="text-sm"><strong>Cost:</strong> {option.cost}</p>
                        <p className="text-sm"><strong>Schedule:</strong> {option.schedule}</p>
                        <p className="text-sm"><strong>GFA:</strong> {option.gfa}</p>
                        <p className="text-sm"><strong>Sustainability:</strong> {option.sustainability}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                        >
                          Select
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                        >
                          View / Modify
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-construction-success hover:bg-construction-success/90"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

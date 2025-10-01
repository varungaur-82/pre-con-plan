import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";

const menuItems = [
  { id: "overview", label: "Design Overview" },
  { id: "alignment", label: "Review Site Alignment" },
  { id: "cost", label: "Generate Cost" },
  { id: "schedule", label: "Build Schedule" },
  { id: "presentation", label: "Client Presentation" },
];

const designOptions = [
  { id: 1, title: "Option 1" },
  { id: 2, title: "Option 2" },
  { id: 3, title: "Option 3" },
];

export function DesignStudio() {
  const [activeMenuItem, setActiveMenuItem] = useState("overview");
  const [aiQuery, setAiQuery] = useState("");

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
      <div className="w-80 bg-card border-l p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-foreground mb-6">Design Options</h2>

        <div className="space-y-6">
          {designOptions.map((option) => (
            <Card key={option.id} className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {option.title}
              </h3>
              
              {/* Placeholder for design thumbnails */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 h-20 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Floor Plan</span>
                </div>
                <div className="w-20 h-20 bg-muted rounded border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">3D</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-construction-success hover:bg-construction-success/90"
                >
                  Select
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upload Design</h3>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="file"
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80"
              />
            </div>
            <Button 
              className="w-full bg-construction-success hover:bg-construction-success/90"
            >
              Generate Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

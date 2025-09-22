import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectTab {
  id: string;
  title: string;
  path: string;
  isActive: boolean;
}

interface ProjectTabsProps {
  tabs: ProjectTab[];
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewProject: () => void;
}

export function ProjectTabs({ tabs, onTabChange, onTabClose, onNewProject }: ProjectTabsProps) {
  return (
    <div className="border-b bg-construction-surface/30 backdrop-blur-sm">
      <div className="container px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Home/Dashboard Tab */}
          <button
            onClick={() => onTabChange("dashboard")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              "hover:bg-construction-grid/50",
              !tabs.some(tab => tab.isActive) 
                ? "text-construction-primary border-b-2 border-construction-primary bg-card/50" 
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </button>

          {/* Project Tabs */}
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors group relative",
                "hover:bg-construction-grid/50 cursor-pointer",
                tab.isActive 
                  ? "text-construction-primary border-b-2 border-construction-primary bg-card/50" 
                  : "text-muted-foreground"
              )}
            >
              <span 
                onClick={() => onTabChange(tab.id)}
                className="truncate max-w-[150px]"
              >
                {tab.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-construction-warning/20 hover:text-construction-warning transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* New Project Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewProject}
            className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-construction-primary hover:bg-construction-primary/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
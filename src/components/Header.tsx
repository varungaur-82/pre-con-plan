import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Plus, Search, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="text-muted-foreground hover:text-construction-primary" />
          
          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search projects, tasks, or documents..." 
              className="pl-10 bg-construction-surface/50 border-construction-grid"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-construction-secondary to-construction-primary rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
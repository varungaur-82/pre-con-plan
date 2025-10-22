import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Save, Users, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "templates", label: "Templates", icon: BarChart3, count: 3, path: "/report-automation/templates" },
  { id: "my-reports", label: "My Reports", icon: Save, count: 2, path: "/report-automation/my-reports" },
  { id: "shared-templates", label: "Shared Templates", icon: Users, path: "/report-automation/shared-templates" },
  { id: "recent-activity", label: "Recent Activity", icon: Clock, count: 3, path: "/report-automation/recent-activity" },
  { id: "training", label: "Training", icon: GraduationCap, path: "/report-automation/training" },
];

interface ReportAutomationLayoutProps {
  children: React.ReactNode;
}

export function ReportAutomationLayout({ children }: ReportAutomationLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">Report Automation</h2>
          <p className="text-xs text-muted-foreground">AI-powered report generation</p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent/50 text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : ""
                    )}
                  >
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

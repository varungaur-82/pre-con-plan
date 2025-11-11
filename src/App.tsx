import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TabProvider } from "@/contexts/TabContext";
import { AppSidebar } from "@/components/AppSidebar";
import { PasscodeAuth } from "./pages/PasscodeAuth";
import { toast } from "sonner";
import Index from "./pages/Index";
import { ProjectsPage } from "./pages/ProjectsPage";
import { TimelinePage } from "./pages/TimelinePage";
import { BudgetPage } from "./pages/BudgetPage";
import { TemplatesPage } from "./pages/report-automation/TemplatesPage";
import { MyReportsPage } from "./pages/report-automation/MyReportsPage";
import { SharedTemplatesPage } from "./pages/report-automation/SharedTemplatesPage";
import { RecentActivityPage } from "./pages/report-automation/RecentActivityPage";
import { TrainingPage } from "./pages/report-automation/TrainingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem("app_authenticated");
    setIsAuthenticated(authenticated === "true");
    setIsLoading(false);
  }, []);

  // Session timeout after 30 minutes of inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
    const WARNING_DURATION = 25 * 60 * 1000; // 25 minutes (5 min before expiry)
    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;
    let warningShown = false;

    const logout = () => {
      localStorage.removeItem("app_authenticated");
      setIsAuthenticated(false);
      toast.info("Session expired due to inactivity");
    };

    const extendSession = () => {
      warningShown = false;
      resetTimeout();
      toast.success("Session extended successfully");
    };

    const showWarning = () => {
      if (!warningShown) {
        warningShown = true;
        toast.warning("Your session will expire in 5 minutes", {
          duration: 300000, // Keep toast for 5 minutes
          action: {
            label: "Extend Session",
            onClick: extendSession,
          },
        });
      }
    };

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      
      warningId = setTimeout(showWarning, WARNING_DURATION);
      timeoutId = setTimeout(logout, TIMEOUT_DURATION);
    };

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimeout);
    });

    // Initialize timeout
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PasscodeAuth onAuthenticated={() => setIsAuthenticated(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TabProvider>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar onLogout={() => {
                  localStorage.removeItem("app_authenticated");
                  setIsAuthenticated(false);
                  toast.success("Logged out successfully");
                }} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/budget" element={<BudgetPage />} />
                    <Route path="/report-automation/templates" element={<TemplatesPage />} />
                    <Route path="/report-automation/my-reports" element={<MyReportsPage />} />
                    <Route path="/report-automation/shared-templates" element={<SharedTemplatesPage />} />
                    <Route path="/report-automation/recent-activity" element={<RecentActivityPage />} />
                    <Route path="/report-automation/training" element={<TrainingPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </TabProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

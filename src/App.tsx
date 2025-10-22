import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TabProvider } from "@/contexts/TabContext";
import { AppSidebar } from "@/components/AppSidebar";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TabProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
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

export default App;

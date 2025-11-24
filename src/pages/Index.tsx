import { Header } from "@/components/Header";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ProjectDetail } from "@/components/ProjectDetail";
import { DashboardStats } from "@/components/DashboardStats";
import { ProjectCard } from "@/components/ProjectCard";
import { RecentActivity } from "@/components/RecentActivity";
import { NewProjectModal } from "@/components/NewProjectModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, BarChart3, FileText, Users, Zap, StickyNote, FolderOpen, File } from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";
import { useState } from "react";
import constructionHero from "@/assets/construction-hero.jpg";
import { ScenarioProvider } from "@/contexts/ScenarioContext";

const Index = () => {
  const { tabs, activeTabId, openTab, closeTab, setActiveTab } =
    useTabContext();
  const { openTab: openTabFn } = useTabContext();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleNewProject = () => {
    setShowNewProjectModal(true);
  };

  return (
    <ScenarioProvider>
    <div className="min-h-screen bg-background">
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
      />
      <Header />

      {/* Tabs are always visible */}
      <ProjectTabs
        tabs={tabs}
        onTabChange={setActiveTab}
        onTabClose={closeTab}
        onNewProject={handleNewProject}
      />

      {/* Show dashboard content when no active tab, otherwise show project detail */}
      {!activeTabId ? (
        <>
          {/* Hero Section */}
          <section className="relative py-10 px-6 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{ backgroundImage: `url(${constructionHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-construction-primary/20 to-construction-secondary/20" />

            <div className="container relative z-10">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-construction-primary mb-4">
                  Optimize Your{" "}
                  <span className="text-construction-secondary">
                    Pre-Construction
                  </span>{" "}
                  Planning
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Manage projects, track budgets, coordinate teams, and ensure
                  regulatory compliance all in one comprehensive platform
                  designed for construction professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-construction-primary to-construction-secondary hover:opacity-90 transition-opacity"
                    onClick={handleNewProject}
                  >
                    Start New Project
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className="border-construction-primary text-construction-primary hover:bg-construction-primary hover:text-white"
                  >
                    View All Projects
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="container px-6 pb-8">
            {/* Dashboard Stats */}
            <section className="mb-5">
              <DashboardStats />
            </section>

            {/* Quick Actions */}
            <section className="mb-5">
              <h2 className="text-xl font-bold text-foreground mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  {
                    icon: Calendar,
                    label: "Schedule Planning",
                    color: "text-construction-primary",
                  },
                  {
                    icon: BarChart3,
                    label: "Budget Analysis",
                    color: "text-construction-secondary",
                  },
                  {
                    icon: FileText,
                    label: "Permit Tracking",
                    color: "text-construction-accent",
                  },
                  {
                    icon: Users,
                    label: "Team Management",
                    color: "text-construction-warning",
                  },
                ].map((action, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-construction-primary/30"
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <action.icon
                        className={`h-7 w-7 mb-2 ${action.color} group-hover:scale-110 transition-transform`}
                      />
                      <span className="text-xs font-medium text-center">
                        {action.label}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Activity and Recent Files Section */}
            <section className="mb-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Zap className="h-4 w-4" />
                      Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Budget approval received</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Foundation milestone completed</p>
                          <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">New drawings uploaded</p>
                          <p className="text-xs text-muted-foreground">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes and Recent Files Combined */}
                <div className="space-y-5">
                  {/* Notes */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <StickyNote className="h-4 w-4" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input 
                        placeholder="Quick notes..." 
                        className="border-muted"
                      />
                    </CardContent>
                  </Card>

                  {/* Recent Files */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FolderOpen className="h-4 w-4" />
                        Recent Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <File className="h-4 w-4 text-red-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Project_Overview.pdf</p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <BarChart3 className="h-4 w-4 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Cost_Analysis_Report.xlsx</p>
                              <p className="text-xs text-muted-foreground">4 hours ago</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Schedule_Milestones.docx</p>
                              <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <BarChart3 className="h-4 w-4 text-orange-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Risk_Assessment.pptx</p>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-5">
              {/* Projects Section */}
              <section className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-foreground">
                    Active Projects
                  </h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid gap-3">
                  {[
                    {
                      id: "1",
                      name: "Downtown Office Complex",
                      location: "New York, NY",
                      budget: 2400000,
                      status: "in-progress" as const,
                      startDate: "Jan 2024",
                      endDate: "Dec 2024",
                      teamSize: 12,
                      progress: 65,
                    },
                    {
                      id: "2",
                      name: "Riverside Apartments",
                      location: "Seattle, WA",
                      budget: 1800000,
                      status: "planning" as const,
                      startDate: "Mar 2024",
                      endDate: "Nov 2024",
                      teamSize: 8,
                      progress: 25,
                    },
                    {
                      id: "3",
                      name: "City Mall Renovation",
                      location: "Chicago, IL",
                      budget: 3200000,
                      status: "on-hold" as const,
                      startDate: "Feb 2024",
                      endDate: "Oct 2024",
                      teamSize: 15,
                      progress: 40,
                    },
                  ].map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>

              {/* Sidebar */}
              <aside className="space-y-3">
                <RecentActivity />

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-construction-surface/50">
                        <div>
                          <p className="font-medium text-xs">
                            Permit Submission
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Downtown Office Complex
                          </p>
                        </div>
                        <span className="text-xs text-construction-warning font-medium">
                          2 days
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-construction-surface/50">
                        <div>
                          <p className="font-medium text-xs">Budget Review</p>
                          <p className="text-[10px] text-muted-foreground">
                            Riverside Apartments
                          </p>
                        </div>
                        <span className="text-xs text-construction-primary font-medium">
                          5 days
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-construction-surface/50">
                        <div>
                          <p className="font-medium text-xs">Site Survey</p>
                          <p className="text-[10px] text-muted-foreground">
                            City Mall Renovation
                          </p>
                        </div>
                        <span className="text-xs text-construction-secondary font-medium">
                          1 week
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </>
      ) : (
        <ProjectDetail projectId={activeTabId} />
      )}
    </div>
    </ScenarioProvider>
  );
};

export default Index;

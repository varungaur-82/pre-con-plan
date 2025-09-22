import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { ProjectCard } from "@/components/ProjectCard";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3, FileText, Users } from "lucide-react";
import constructionHero from "@/assets/construction-hero.jpg";

const Index = () => {
  const mockProjects = [
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
  ];

  const quickActions = [
    { icon: Calendar, label: "Schedule Planning", color: "text-construction-primary" },
    { icon: BarChart3, label: "Budget Analysis", color: "text-construction-secondary" },
    { icon: FileText, label: "Permit Tracking", color: "text-construction-accent" },
    { icon: Users, label: "Team Management", color: "text-construction-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${constructionHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-construction-primary/20 to-construction-secondary/20" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Streamline Your <span className="text-construction-primary">Pre-Construction</span> Planning
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Manage projects, track budgets, coordinate teams, and ensure regulatory compliance 
              all in one comprehensive platform designed for construction professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-construction-primary to-construction-secondary hover:opacity-90 transition-opacity">
                Start New Project
              </Button>
              <Button variant="outline" size="lg" className="border-construction-primary text-construction-primary hover:bg-construction-primary hover:text-white">
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-6 pb-12">
        {/* Dashboard Stats */}
        <section className="mb-12">
          <DashboardStats />
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-construction-primary/30">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <action.icon className={`h-8 w-8 mb-3 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid gap-6">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <RecentActivity />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-construction-surface/50">
                    <div>
                      <p className="font-medium text-sm">Permit Submission</p>
                      <p className="text-xs text-muted-foreground">Downtown Office Complex</p>
                    </div>
                    <span className="text-xs text-construction-warning font-medium">2 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-construction-surface/50">
                    <div>
                      <p className="font-medium text-sm">Budget Review</p>
                      <p className="text-xs text-muted-foreground">Riverside Apartments</p>
                    </div>
                    <span className="text-xs text-construction-primary font-medium">5 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-construction-surface/50">
                    <div>
                      <p className="font-medium text-sm">Site Survey</p>
                      <p className="text-xs text-muted-foreground">City Mall Renovation</p>
                    </div>
                    <span className="text-xs text-construction-secondary font-medium">1 week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
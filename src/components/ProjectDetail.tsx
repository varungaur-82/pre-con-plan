import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, DollarSign, Users, ArrowLeft } from "lucide-react";
import { useTabContext } from "@/contexts/TabContext";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { closeTab } = useTabContext();

  // Mock project data - in real app, this would come from props or API
  const project = {
    id: projectId,
    name: projectId === "1" ? "Downtown Office Complex" : 
          projectId === "2" ? "Riverside Apartments" : "City Mall Renovation",
    location: projectId === "1" ? "New York, NY" : 
              projectId === "2" ? "Seattle, WA" : "Chicago, IL",
    budget: projectId === "1" ? 2400000 : 
            projectId === "2" ? 1800000 : 3200000,
    status: projectId === "1" ? "in-progress" : 
            projectId === "2" ? "planning" : "on-hold",
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    teamSize: projectId === "1" ? 12 : 
              projectId === "2" ? 8 : 15,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };

  return (
    <div className="container px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeTab(projectId)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            {project.location}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" value={project.name} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={project.location} className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={project.description}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={project.startDate} 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={project.endDate} 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={project.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="bg-gradient-to-r from-construction-primary to-construction-secondary">
                  Save Changes
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { phase: "Site Survey", status: "completed", date: "Jan 2024" },
                  { phase: "Permit Application", status: "completed", date: "Feb 2024" },
                  { phase: "Design Review", status: "in-progress", date: "Mar 2024" },
                  { phase: "Budget Approval", status: "pending", date: "Apr 2024" },
                  { phase: "Construction Start", status: "pending", date: "May 2024" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-construction-surface/50">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === "completed" ? "bg-construction-success" :
                      item.status === "in-progress" ? "bg-construction-primary" :
                      "bg-construction-grid"
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{item.phase}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "completed" ? "bg-construction-success/20 text-construction-success" :
                      item.status === "in-progress" ? "bg-construction-primary/20 text-construction-primary" :
                      "bg-construction-grid/20 text-muted-foreground"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-construction-primary" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  ${project.budget.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Materials</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-construction-grid rounded-full h-2">
                  <div className="bg-construction-primary rounded-full h-2 w-[65%]" />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Labor</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-construction-grid rounded-full h-2">
                  <div className="bg-construction-secondary rounded-full h-2 w-[25%]" />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Equipment</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-construction-grid rounded-full h-2">
                  <div className="bg-construction-accent rounded-full h-2 w-[10%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-construction-secondary" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "John Smith", role: "Project Manager", avatar: "JS" },
                  { name: "Sarah Johnson", role: "Architect", avatar: "SJ" },
                  { name: "Mike Davis", role: "Engineer", avatar: "MD" },
                  { name: "Lisa Brown", role: "Site Supervisor", avatar: "LB" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-construction-primary to-construction-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
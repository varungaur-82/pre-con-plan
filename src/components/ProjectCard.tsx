import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    location: string;
    budget: number;
    status: "planning" | "in-progress" | "completed" | "on-hold";
    startDate: string;
    endDate: string;
    teamSize: number;
    progress: number;
  };
}

const statusColors = {
  planning: "bg-construction-accent/20 text-construction-accent border-construction-accent/30",
  "in-progress": "bg-construction-primary/20 text-construction-primary border-construction-primary/30",
  completed: "bg-construction-success/20 text-construction-success border-construction-success/30",
  "on-hold": "bg-construction-warning/20 text-construction-warning border-construction-warning/30",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-construction-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-construction-primary transition-colors">
            {project.name}
          </CardTitle>
          <Badge className={statusColors[project.status]}>
            {project.status.replace("-", " ")}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {project.location}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-construction-primary" />
            <span className="font-medium">${project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-construction-secondary" />
            <span>{project.teamSize} members</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-construction-grid rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-construction-primary to-construction-secondary rounded-full h-2 transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{project.startDate} - {project.endDate}</span>
        </div>

        <Button className="w-full mt-4 bg-gradient-to-r from-construction-primary to-construction-secondary hover:opacity-90 transition-opacity">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
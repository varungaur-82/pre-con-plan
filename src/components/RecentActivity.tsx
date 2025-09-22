import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, CheckCircle } from "lucide-react";

interface Activity {
  id: string;
  type: "permit" | "budget" | "timeline" | "completion";
  project: string;
  description: string;
  timestamp: string;
  status: "pending" | "approved" | "completed";
}

const activityIcons = {
  permit: FileText,
  budget: DollarSign,
  timeline: Calendar,
  completion: CheckCircle,
};

const activityColors = {
  permit: "text-construction-accent",
  budget: "text-construction-primary",
  timeline: "text-construction-secondary",
  completion: "text-construction-success",
};

const statusColors = {
  pending: "bg-construction-warning/20 text-construction-warning",
  approved: "bg-construction-success/20 text-construction-success", 
  completed: "bg-construction-primary/20 text-construction-primary",
};

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "permit",
      project: "Downtown Office Complex",
      description: "Building permit submitted for review",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: "2", 
      type: "budget",
      project: "Riverside Apartments",
      description: "Budget updated - material costs revised",
      timestamp: "4 hours ago",
      status: "approved",
    },
    {
      id: "3",
      type: "timeline",
      project: "City Mall Renovation",
      description: "Phase 1 timeline extended by 2 weeks",
      timestamp: "1 day ago",
      status: "approved",
    },
    {
      id: "4",
      type: "completion",
      project: "Suburban Housing",
      description: "Site survey completed successfully",
      timestamp: "2 days ago",
      status: "completed",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-construction-surface/50">
                <div className={`p-2 rounded-lg bg-card ${activityColors[activity.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.project}
                    </p>
                    <Badge className={statusColors[activity.status]}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
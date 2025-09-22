import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

export function TimelinePage() {
  return (
    <PageLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
        <p className="text-muted-foreground">Track project schedules and milestones</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-construction-primary" />
              Project Timeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Site Survey", status: "completed", date: "Jan 15, 2024" },
                { name: "Permit Application", status: "completed", date: "Feb 1, 2024" },
                { name: "Design Review", status: "in-progress", date: "Mar 1, 2024" },
                { name: "Material Procurement", status: "pending", date: "Apr 1, 2024" },
                { name: "Construction Start", status: "pending", date: "May 1, 2024" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-construction-surface/50">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === "completed" ? "bg-construction-success" :
                    item.status === "in-progress" ? "bg-construction-primary" :
                    "bg-construction-grid"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "completed" && <CheckCircle className="h-4 w-4 text-construction-success" />}
                    {item.status === "in-progress" && <Clock className="h-4 w-4 text-construction-primary" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </PageLayout>
  );
}
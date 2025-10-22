import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportAutomationLayout } from "@/components/ReportAutomationLayout";

export function RecentActivityPage() {
  return (
    <ReportAutomationLayout>
      <div className="container px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recent Activity</h1>
          <p className="text-muted-foreground">Recent report activities</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity history will appear here...</p>
          </CardContent>
        </Card>
      </div>
    </ReportAutomationLayout>
  );
}

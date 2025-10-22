import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportAutomationLayout } from "@/components/ReportAutomationLayout";

export function MyReportsPage() {
  return (
    <ReportAutomationLayout>
      <div className="container px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Reports</h1>
          <p className="text-muted-foreground">Your generated reports</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your reports will appear here...</p>
          </CardContent>
        </Card>
      </div>
    </ReportAutomationLayout>
  );
}

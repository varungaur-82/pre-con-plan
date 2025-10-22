import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportAutomationLayout } from "@/components/ReportAutomationLayout";

export function TrainingPage() {
  return (
    <ReportAutomationLayout>
      <div className="container px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training</h1>
          <p className="text-muted-foreground">Learn how to use report automation</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Training Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Training materials will appear here...</p>
          </CardContent>
        </Card>
      </div>
    </ReportAutomationLayout>
  );
}

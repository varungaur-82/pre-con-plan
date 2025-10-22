import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportAutomationLayout } from "@/components/ReportAutomationLayout";

export function TemplatesPage() {
  return (
    <ReportAutomationLayout>
      <div className="container px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Templates</h1>
          <p className="text-muted-foreground">AI-powered report templates</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Template management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </ReportAutomationLayout>
  );
}

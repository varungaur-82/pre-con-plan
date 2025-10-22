import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportAutomationLayout } from "@/components/ReportAutomationLayout";

export function SharedTemplatesPage() {
  return (
    <ReportAutomationLayout>
      <div className="container px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shared Templates</h1>
          <p className="text-muted-foreground">Team shared templates</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Shared Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Shared templates will appear here...</p>
          </CardContent>
        </Card>
      </div>
    </ReportAutomationLayout>
  );
}

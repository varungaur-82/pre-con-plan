import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";

export function TemplatesPage() {
  return (
    <PageLayout>
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
    </PageLayout>
  );
}

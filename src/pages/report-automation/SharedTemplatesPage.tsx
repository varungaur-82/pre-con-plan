import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";

export function SharedTemplatesPage() {
  return (
    <PageLayout>
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
    </PageLayout>
  );
}

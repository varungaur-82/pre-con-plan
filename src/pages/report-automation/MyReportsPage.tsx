import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";

export function MyReportsPage() {
  return (
    <PageLayout>
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
    </PageLayout>
  );
}

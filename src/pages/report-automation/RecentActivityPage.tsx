import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/PageLayout";

export function RecentActivityPage() {
  return (
    <PageLayout>
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
    </PageLayout>
  );
}

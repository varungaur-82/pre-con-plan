import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

export function BudgetPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
        <p className="text-muted-foreground">Track project costs and financial planning</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$2.4M</div>
            <div className="flex items-center gap-1 text-sm text-construction-success">
              <TrendingUp className="h-4 w-4" />
              <span>On track</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1.2M</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>50% of budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1.2M</div>
            <div className="flex items-center gap-1 text-sm text-construction-warning">
              <TrendingDown className="h-4 w-4" />
              <span>Monitor closely</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-construction-primary" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Materials", allocated: 1560000, spent: 780000, percentage: 65 },
              { category: "Labor", allocated: 600000, spent: 300000, percentage: 25 },
              { category: "Equipment", allocated: 240000, spent: 120000, percentage: 10 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-construction-grid rounded-full h-2">
                  <div 
                    className="bg-construction-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
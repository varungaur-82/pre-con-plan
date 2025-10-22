import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileText } from "lucide-react";

export function AutomationHub() {
  return (
    <div className="container px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cost Tracker Button */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="mb-6">
                <BarChart3 className="w-24 h-24 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Cost Tracker</h2>
              <p className="text-muted-foreground">
                Perfect for presentations and executive briefings
              </p>
            </CardContent>
          </Card>

          {/* Report Automation Button */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="mb-6">
                <FileText className="w-24 h-24 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Report Automation</h2>
              <p className="text-muted-foreground">
                Ideal for detailed reports and documentation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

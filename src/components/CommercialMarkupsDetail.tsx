import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";

interface CommercialMarkupsDetailProps {
  onBack: () => void;
}

export function CommercialMarkupsDetail({ onBack }: CommercialMarkupsDetailProps) {
  const markups = [
    { label: "General Requirements", value: "8.5%" },
    { label: "OH&P / CM Fee", value: "10.0%" },
    { label: "Bond & Insurance", value: "1.5%" },
    { label: "Sales/Use Tax", value: "8.25%" }
  ];

  const policies = [
    { label: "Escalation Start", value: "2024-Q1" },
    { label: "Escalation Curve", value: "NYC Standard" },
    { label: "Project Duration", value: "18 months" },
    { label: "Delivery Model", value: "CMAR" }
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">Commercial Markups & Policies</h2>
              <p className="text-sm text-muted-foreground">
                OH&P, tax, bond, escalation policies
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit All
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Markups */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Markups</h3>
              {markups.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Policies</h3>
              {policies.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-xl font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

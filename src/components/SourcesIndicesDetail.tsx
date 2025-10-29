import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Edit, RefreshCw } from "lucide-react";

interface SourcesIndicesDetailProps {
  onBack: () => void;
}

export function SourcesIndicesDetail({ onBack }: SourcesIndicesDetailProps) {
  const sources = [
    { trade: "Site Work", source: "RSMeans", reference: "NYC 2024 Q3", sourceDate: "2024-01-15", laborSet: "Union", regional: "1.12", productivity: "1", escalation: "Standard" },
    { trade: "Concrete", source: "Vendor Quote", reference: "Quote #2024-001", sourceDate: "2024-02-01", laborSet: "Union", regional: "1.15", productivity: "0.95", escalation: "Conservative" },
    { trade: "Masonry", source: "Internal Benchmark", reference: "2023-12 Similar", sourceDate: "2023-12-15", laborSet: "Union", regional: "1.1", productivity: "1", escalation: "Standard" },
    { trade: "Structural Steel", source: "RSMeans", reference: "NYC 2024 Q2", sourceDate: "2024-03-01", laborSet: "Union", regional: "1.18", productivity: "0.9", escalation: "Aggressive" },
    { trade: "Carpentry", source: "Vendor Quote", reference: "Quote #2024-002", sourceDate: "2024-01-20", laborSet: "Open Shop", regional: "1.05", productivity: "1.05", escalation: "Standard" },
    { trade: "Thermal & Moisture", source: "RSMeans", reference: "LA 2024 Q1", sourceDate: "2024-01-10", laborSet: "Mixed", regional: "1.08", productivity: "1", escalation: "Standard" },
    { trade: "Openings", source: "Internal Benchmark", reference: "2023-11 Similar", sourceDate: "2023-11-20", laborSet: "Union", regional: "1.12", productivity: "0.95", escalation: "Conservative" },
    { trade: "Finishes", source: "Vendor Quote", reference: "Quote #2024-003", sourceDate: "2024-02-15", laborSet: "Open Shop", regional: "1.06", productivity: "1.08", escalation: "Standard" },
    { trade: "Specialties", source: "RSMeans", reference: "NYC 2024 Q3", sourceDate: "2024-03-10", laborSet: "Mixed", regional: "1.09", productivity: "1", escalation: "Standard" },
    { trade: "Equipment", source: "Internal Benchmark", reference: "2023-10 Similar", sourceDate: "2023-10-15", laborSet: "Union", regional: "1.14", productivity: "0.92", escalation: "Conservative" },
    { trade: "Furnishings", source: "Vendor Quote", reference: "Quote #2024-004", sourceDate: "2024-01-25", laborSet: "Open Shop", regional: "1.03", productivity: "1.1", escalation: "Standard" },
    { trade: "Special Construction", source: "RSMeans", reference: "LA 2024 Q2", sourceDate: "2024-02-20", laborSet: "Union", regional: "1.11", productivity: "0.98", escalation: "Standard" },
    { trade: "Conveying Equipment", source: "Vendor Quote", reference: "Quote #2024-005", sourceDate: "2024-03-05", laborSet: "Union", regional: "1.16", productivity: "0.88", escalation: "Aggressive" },
    { trade: "Fire Suppression", source: "Internal Benchmark", reference: "2023-09 Similar", sourceDate: "2023-09-10", laborSet: "Union", regional: "1.13", productivity: "0.94", escalation: "Conservative" },
    { trade: "Plumbing", source: "RSMeans", reference: "NYC 2024 Q3", sourceDate: "2024-03-15", laborSet: "Union", regional: "1.17", productivity: "0.9", escalation: "Aggressive" },
    { trade: "HVAC", source: "Vendor Quote", reference: "Quote #2024-006", sourceDate: "2024-02-10", laborSet: "Union", regional: "1.2", productivity: "0.85", escalation: "Aggressive" },
    { trade: "Electrical", source: "Internal Benchmark", reference: "2023-08 Similar", sourceDate: "2023-08-20", laborSet: "Union", regional: "1.15", productivity: "0.92", escalation: "Conservative" },
    { trade: "Communications", source: "RSMeans", reference: "LA 2024 Q3", sourceDate: "2024-03-20", laborSet: "Open Shop", regional: "1.04", productivity: "1.12", escalation: "Standard" },
    { trade: "Electronic Safety", source: "Vendor Quote", reference: "Quote #2024-007", sourceDate: "2024-01-30", laborSet: "Union", regional: "1.08", productivity: "1", escalation: "Standard" },
    { trade: "Earthwork", source: "RSMeans", reference: "NYC 2024 Q2", sourceDate: "2024-02-25", laborSet: "Union", regional: "1.19", productivity: "0.89", escalation: "Aggressive" },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">Sources & Indices</h2>
              <p className="text-sm text-muted-foreground">
                Industry standard CSI divisions with data sources
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <span className="mr-2">+</span>
            Add Source
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/50 border-b z-10">
            <tr className="text-xs">
              <th className="text-left p-3 font-medium">Trade</th>
              <th className="text-left p-3 font-medium">Source</th>
              <th className="text-left p-3 font-medium">Reference</th>
              <th className="text-left p-3 font-medium">Source Date</th>
              <th className="text-left p-3 font-medium">Labor Set</th>
              <th className="text-right p-3 font-medium">Regional</th>
              <th className="text-right p-3 font-medium">Productivity</th>
              <th className="text-left p-3 font-medium">Escalation</th>
              <th className="text-center p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sources.map((source, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/20">
                <td className="p-3 font-medium">{source.trade}</td>
                <td className="p-3">
                  <Badge
                    variant="secondary"
                    className={
                      source.source === "RSMeans"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : source.source === "Vendor Quote"
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                    }
                  >
                    {source.source}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">{source.reference}</td>
                <td className="p-3">{source.sourceDate}</td>
                <td className="p-3">{source.laborSet}</td>
                <td className="p-3 text-right">{source.regional}</td>
                <td className="p-3 text-right">{source.productivity}</td>
                <td className="p-3">{source.escalation}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

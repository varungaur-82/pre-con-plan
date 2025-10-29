import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

interface RiskRegisterDetailProps {
  onBack: () => void;
}

export function RiskRegisterDetail({ onBack }: RiskRegisterDetailProps) {
  const risks = [
    {
      title: "Material price escalation",
      description: "Steel, concrete and electrical materials experiencing significant price volatility due to supply chain disruptions and increased demand. This affects all major trades throughout the project duration.",
      probability: "60%",
      costImpact: "$2,500,000",
      scheduleImpact: "2-4 weeks delay",
      owner: "Project Controls",
      linkedScope: "All trades",
      costBasis: "Based on RSMeans material escalation trends and current market volatility indicators. Historical data shows 15-25% annual escalation for key materials.",
      badge: "Market Risk",
      badgeColor: "bg-red-100 text-red-800"
    },
    {
      title: "Labor shortage in Q4 2025",
      description: "Skilled trades shortage expected in Q4 2025 due to multiple large projects competing for limited skilled workforce. Particularly impacts MEP trades requiring specialized certifications.",
      probability: "40%",
      costImpact: "$1,800,000",
      scheduleImpact: "6-8 weeks delay",
      owner: "CM",
      linkedScope: "MEP trades",
      costBasis: "Analysis of current labor market conditions and projected demand from competing projects. Premium rates required to secure skilled workers.",
      badge: "Labor Market",
      badgeColor: "bg-orange-100 text-orange-800"
    },
    {
      title: "Permit delays",
      description: "Municipal permit approval process experiencing backlogs due to staffing shortages and increased development activity. Critical path items include foundation and structural permits.",
      probability: "30%",
      costImpact: "$900,000",
      scheduleImpact: "4-6 weeks delay",
      owner: "Owner Rep",
      linkedScope: "Site mobilization",
      costBasis: "Current permit processing times from city records and discussions with permit office. Additional expediting fees and carrying costs.",
      badge: "Approval Risk",
      badgeColor: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Weather-related delays",
      description: "Severe weather events during critical construction phases, particularly winter months affecting exterior work and site access. Historical data shows increased frequency of extreme weather.",
      probability: "50%",
      costImpact: "$750,000",
      scheduleImpact: "3-5 weeks delay",
      owner: "CM",
      linkedScope: "Site work, exterior finishes",
      costBasis: "Historical weather data analysis and climate change projections. Additional weather protection measures and contingency planning required.",
      badge: "Environmental Risk",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Design coordination issues",
      description: "Complex MEP coordination requiring extensive design revisions and field adjustments. High-rise building with tight ceiling spaces and multiple system conflicts.",
      probability: "40%",
      costImpact: "$1,200,000",
      scheduleImpact: "2-3 weeks delay",
      owner: "Design Team",
      linkedScope: "MEP coordination",
      costBasis: "Complexity analysis of MEP systems and historical data from similar high-rise projects. Additional coordination meetings and design iterations anticipated.",
      badge: "Design Risk",
      badgeColor: "bg-purple-100 text-purple-800"
    }
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
              <h2 className="text-xl font-semibold">Risk Register</h2>
            </div>
          </div>
          <Button variant="destructive" size="sm">
            <span className="mr-2">+</span>
            Add Risk
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {risks.map((risk, idx) => (
            <div key={idx} className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{risk.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                </div>
                <Badge variant="secondary" className={risk.badgeColor}>
                  {risk.badge}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Probability:</div>
                  <div className="font-semibold">{risk.probability}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Cost Impact:</div>
                  <div className="font-semibold text-red-600">{risk.costImpact}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Schedule Impact:</div>
                  <div className="font-semibold text-orange-600">{risk.scheduleImpact}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Owner:</div>
                  <div className="font-semibold">{risk.owner}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Linked Scope:</span>
                  <div className="text-muted-foreground">{risk.linkedScope}</div>
                </div>
                <div>
                  <span className="font-medium">Cost Basis:</span>
                  <div className="text-muted-foreground">{risk.costBasis}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

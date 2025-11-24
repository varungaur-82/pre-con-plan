import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, Clock, AlertTriangle } from "lucide-react";
import { useScenario } from "@/contexts/ScenarioContext";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  color: "primary" | "secondary" | "accent" | "warning";
}

const colorClasses = {
  primary: "text-construction-primary",
  secondary: "text-construction-secondary", 
  accent: "text-construction-accent",
  warning: "text-construction-warning",
};

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={colorClasses[color]}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend.direction === "up" ? "text-construction-success" : "text-construction-warning"}>
              {trend.direction === "up" ? "↗" : "↘"} {trend.value}
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { parameters } = useScenario();
  
  // Calculate impacts based on scenario parameters
  const budgetImpact = () => {
    let impact = 0;
    if (parameters.designAssistEnvelope) impact += 1.5;
    if (parameters.designAssistMEP) impact += 1.5;
    if (parameters.deliveryMethod === "design-build") impact += 2;
    return impact;
  };

  const timelineImpact = () => {
    let impact = 0;
    if (parameters.designAssistEnvelope) impact -= 0.15;
    if (parameters.designAssistMEP) impact -= 0.15;
    if (parameters.deliveryMethod === "design-build") impact -= 0.3;
    return impact;
  };

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: <Building2 className="h-4 w-4" />,
      trend: { value: "+2", direction: "up" as const },
      color: "primary" as const,
    },
    {
      title: "Total Budget",
      value: `$${(2.4 + budgetImpact() / 10).toFixed(1)}M`,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: { value: budgetImpact() > 0 ? `+${budgetImpact().toFixed(1)}%` : `${budgetImpact().toFixed(1)}%`, direction: budgetImpact() >= 0 ? "up" as const : "down" as const },
      color: "secondary" as const,
    },
    {
      title: "Avg Timeline",
      value: `${(8.2 + timelineImpact()).toFixed(1)} months`,
      icon: <Clock className="h-4 w-4" />,
      trend: { value: timelineImpact().toFixed(1), direction: timelineImpact() < 0 ? "down" as const : "up" as const },
      color: "accent" as const,
    },
    {
      title: "Pending Reviews",
      value: "5",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "warning" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
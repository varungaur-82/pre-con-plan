import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Share2, Calendar, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, BarChart3, PieChart, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GeneratedReportViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: {
    reportName: string;
    templateTitle: string;
    dateRange: string;
    selectedDataSources: string[];
    selectedKPIs: string[];
    scheduleType: string;
    frequency: string;
  };
}

export function GeneratedReportView({ open, onOpenChange, reportData }: GeneratedReportViewProps) {
  const generateMockData = () => {
    // Generate realistic mock data based on selected KPIs
    return reportData.selectedKPIs.map((kpi, index) => ({
      kpi,
      current: Math.floor(Math.random() * 100) + 50,
      previous: Math.floor(Math.random() * 100) + 50,
      target: Math.floor(Math.random() * 100) + 70,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: (Math.random() * 20 - 10).toFixed(1),
    }));
  };

  const mockData = generateMockData();
  
  const getStatusColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (change: string) => {
    const changeNum = parseFloat(change);
    if (changeNum > 5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (changeNum > 0) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (changeNum > -5) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2">
                {reportData.reportName}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <Badge variant="outline">{reportData.templateTitle}</Badge>
                <Badge variant="secondary">{reportData.dateRange.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Executive Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground leading-relaxed text-sm">
                This {reportData.templateTitle.toLowerCase()} covers the period of {reportData.dateRange.replace(/-/g, ' ')}. 
                Analysis includes data from {reportData.selectedDataSources.length} sources: {reportData.selectedDataSources.slice(0, 3).join(', ')}
                {reportData.selectedDataSources.length > 3 && ` and ${reportData.selectedDataSources.length - 3} more`}.
                Overall performance shows positive trends across {mockData.filter(d => d.trend === 'up').length} of {mockData.length} key metrics,
                with particular strength in operational efficiency and cost management. The data reveals consistent improvements in project delivery timelines 
                and resource utilization, while maintaining budget adherence across all monitored cost centers.
              </p>
            </CardContent>
          </Card>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockData.slice(0, 3).map((data, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{data.kpi}</p>
                      <p className="text-3xl font-bold">{data.current}%</p>
                    </div>
                    {data.trend === 'up' ? (
                      <TrendingUp className={`h-8 w-8 ${getStatusColor(data.trend)}`} />
                    ) : (
                      <TrendingDown className={`h-8 w-8 ${getStatusColor(data.trend)}`} />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm font-medium ${getStatusColor(data.trend)}`}>
                      {data.change}% vs previous period
                    </span>
                    {getStatusBadge(data.change)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Metrics Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-primary" />
                Detailed Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Previous</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{data.kpi}</TableCell>
                      <TableCell className="text-right">{data.current}%</TableCell>
                      <TableCell className="text-right">{data.previous}%</TableCell>
                      <TableCell className="text-right">{data.target}%</TableCell>
                      <TableCell className={`text-right font-medium ${getStatusColor(data.trend)}`}>
                        {data.change}%
                      </TableCell>
                      <TableCell>{getStatusBadge(data.change)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Visual Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PieChart className="h-5 w-5 text-primary" />
                  Data Source Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.selectedDataSources.map((source, index) => {
                    const percentage = Math.floor(100 / reportData.selectedDataSources.length);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="font-medium">{source}</span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Key Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-green-900">Strong Performance</p>
                    <p className="text-sm text-green-700">
                      {mockData.filter(d => d.trend === 'up').length} metrics showing positive growth trends
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-amber-900">Areas for Improvement</p>
                    <p className="text-sm text-amber-700">
                      Focus on {mockData.filter(d => d.trend === 'down')[0]?.kpi || 'key metrics'} to optimize overall performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-blue-900">Next Steps</p>
                    <p className="text-sm text-blue-700">
                      Schedule follow-up review {reportData.scheduleType === 'recurring' ? reportData.frequency : 'next month'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Footer */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <p>Generated: {new Date().toLocaleString()}</p>
                  <p className="mt-1">Schedule: {reportData.scheduleType === 'one-time' ? 'One-time Report' : `Recurring (${reportData.frequency})`}</p>
                </div>
                <div className="text-right">
                  <p>Data Sources: {reportData.selectedDataSources.length}</p>
                  <p className="mt-1">KPIs Tracked: {reportData.selectedKPIs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

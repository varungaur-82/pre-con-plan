import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, BarChart3, User, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Database, Clock, FileText, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  title: string;
  badge: string;
  description: string;
  frequency: string;
  stakeholder: string;
  metrics: string[];
  previewColors: string[];
  suggestedKPIs?: string[];
  suggestedDataSources?: string[];
}

interface CreateReportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
}

export function CreateReportWizard({ open, onOpenChange, templates }: CreateReportWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [dateRange, setDateRange] = useState("last-30-days");
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState("one-time");
  const [frequency, setFrequency] = useState("weekly");
  const { toast } = useToast();

  const dataSources = [
    { id: "admin", name: "Admin Documents", icon: "📋" },
    { id: "financials", name: "Financials", icon: "💰" },
    { id: "drawings", name: "Drawings", icon: "📐" },
    { id: "reports", name: "Reports Archive", icon: "📊" },
    { id: "correspondence", name: "Correspondence", icon: "✉️" },
    { id: "contracts", name: "Contracts & Legal", icon: "📜" },
    { id: "schedules", name: "Schedules", icon: "📅" },
    { id: "procurement", name: "Procurement", icon: "🛒" },
  ];

  const allKPIs = [
    "Budget Variance",
    "Cost Efficiency Index",
    "Schedule Performance",
    "Critical Path Variance",
    "Risk Score",
    "Quality Metrics",
    "Change Order Impact",
    "Resource Utilization",
    "Milestone Achievement",
    "Compliance Rate",
    "Safety Incidents",
    "Vendor Performance",
  ];

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setReportName(template.title);
    setReportDescription(template.description);
    
    // AI-powered suggestions
    if (template.suggestedKPIs) {
      setSelectedKPIs(template.suggestedKPIs);
    }
    if (template.suggestedDataSources) {
      setSelectedDataSources(template.suggestedDataSources);
    }
    
    setStep(2);
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Report Created Successfully! 🎉",
      description: `${reportName} has been created and ${scheduleType === "one-time" ? "will be generated shortly" : `scheduled to run ${frequency}`}.`,
    });
    
    // Reset wizard
    setStep(1);
    setSelectedTemplate(null);
    setReportName("");
    setReportDescription("");
    setDateRange("last-30-days");
    setSelectedDataSources([]);
    setSelectedKPIs([]);
    setScheduleType("one-time");
    setFrequency("weekly");
    onOpenChange(false);
  };

  const toggleDataSource = (id: string) => {
    setSelectedDataSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleKPI = (kpi: string) => {
    setSelectedKPIs(prev =>
      prev.includes(kpi) ? prev.filter(k => k !== kpi) : [...prev, kpi]
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Choose Your Template";
      case 2: return "Configure Report Details";
      case 3: return "Select Data Sources";
      case 4: return "Choose KPIs & Metrics";
      case 5: return "Schedule & Review";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Select from our enterprise-grade report templates";
      case 2: return "Customize your report name, description, and date range";
      case 3: return "Choose which data sources to include in your report";
      case 4: return "Select the key performance indicators to track";
      case 5: return "Review your selections and set up automation";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-1">
                {getStepTitle()}
              </DialogTitle>
              <p className="text-muted-foreground">{getStepDescription()}</p>
            </div>
            {step > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Step {step} of 5</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {step > 1 && (
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all cursor-pointer hover:border-primary overflow-hidden"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {/* Preview Area */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-3 bg-blue-300 rounded-full w-3/4"></div>
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {template.previewColors.map((color, i) => (
                        <div key={i} className={`h-16 ${color} rounded flex-1`}></div>
                      ))}
                    </div>
                  </div>

                  {/* Content Area */}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg leading-tight flex-1">
                        {template.title}
                      </h3>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {template.badge}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{template.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{template.stakeholder}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {template.metrics.slice(0, 2).map((metric, i) => (
                        <div key={i} className="text-sm text-primary">
                          {metric}
                        </div>
                      ))}
                      {template.metrics.length > 2 && (
                        <div className="text-sm text-muted-foreground">
                          {template.metrics[2]}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 2: Report Configuration */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name *</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Describe the purpose and scope of this report"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="date-range">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">AI Suggestion</p>
                      <p className="text-sm text-blue-700">
                        Based on the template you selected, we recommend using a 30-day date range 
                        to capture meaningful trends and patterns in your data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Data Sources */}
          {step === 3 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                <Database className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 mb-1">AI Recommendations</p>
                  <p className="text-sm text-amber-700">
                    We've pre-selected the most relevant data sources based on your template. 
                    You can adjust these selections as needed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dataSources.map((source) => (
                  <Card
                    key={source.id}
                    className={`cursor-pointer transition-all ${
                      selectedDataSources.includes(source.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleDataSource(source.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{source.icon}</div>
                      <div className="font-medium text-sm mb-2">{source.name}</div>
                      <Checkbox
                        checked={selectedDataSources.includes(source.id)}
                        className="pointer-events-none"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: KPIs Selection */}
          {step === 4 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">Smart KPI Selection</p>
                  <p className="text-sm text-green-700">
                    AI has pre-selected key metrics that align with your report template and data sources. 
                    Select at least 3 KPIs for comprehensive analysis.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allKPIs.map((kpi) => (
                  <Card
                    key={kpi}
                    className={`cursor-pointer transition-all ${
                      selectedKPIs.includes(kpi)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleKPI(kpi)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Checkbox
                        checked={selectedKPIs.includes(kpi)}
                        className="pointer-events-none"
                      />
                      <span className="font-medium text-sm">{kpi}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Schedule & Review */}
          {step === 5 && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Schedule Settings */}
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Report Schedule
                    </Label>
                    
                    <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="cursor-pointer">
                          Generate Once (One-time report)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recurring" id="recurring" />
                        <Label htmlFor="recurring" className="cursor-pointer">
                          Recurring Schedule (Automated)
                        </Label>
                      </div>
                    </RadioGroup>

                    {scheduleType === "recurring" && (
                      <div className="ml-6 mt-4 space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger id="frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Review Summary */}
              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Review Your Report Configuration</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Report Name:</span>
                      <span className="font-medium">{reportName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">{selectedTemplate?.title}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Date Range:</span>
                      <span className="font-medium">{dateRange.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Data Sources:</span>
                      <span className="font-medium">{selectedDataSources.length} selected</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">KPIs:</span>
                      <span className="font-medium">{selectedKPIs.length} metrics</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">
                        {scheduleType === "one-time" ? "One-time" : `Recurring (${frequency})`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mt-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 mb-1">Ready to Generate!</p>
                      <p className="text-sm text-green-700">
                        Your report configuration looks great. Click "Create Report" to finalize.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {step < 5 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
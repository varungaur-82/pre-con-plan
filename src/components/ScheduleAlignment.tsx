import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Link2, Clock, Eye, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ScheduleTask {
  id: string;
  name: string;
  startMonth: number;
  duration: number;
  baselineStart?: number;
  baselineDuration?: number;
  status: 'baseline' | 'current' | 'delayed' | 'accelerated' | 'proposed-pending' | 'proposed-accepted';
  isMilestone?: boolean;
}

const scheduleData: ScheduleTask[] = [
  { id: "1", name: "SD - Site & Civil Concepts", startMonth: 1, duration: 1.5, baselineStart: 1, baselineDuration: 1.5, status: 'baseline' },
  { id: "2", name: "SD - Arch/Structural Concepts", startMonth: 1.5, duration: 2.5, baselineStart: 1.5, baselineDuration: 2.5, status: 'baseline' },
  { id: "3", name: "SD - MEPF Concepts & Loads", startMonth: 1, duration: 1.5, baselineStart: 1, baselineDuration: 1.5, status: 'baseline' },
  { id: "4", name: "DD - Arch/Struct 30/60%", startMonth: 3.5, duration: 3, baselineStart: 3.5, baselineDuration: 3, status: 'baseline' },
  { id: "5", name: "DD - MEPF 30/60%", startMonth: 3.5, duration: 3, baselineStart: 3.5, baselineDuration: 3, status: 'baseline' },
  { id: "6", name: "CDs - Arch/Struct 90/FC", startMonth: 6.5, duration: 2, baselineStart: 6.5, baselineDuration: 2, status: 'baseline' },
  { id: "7", name: "SD Owner Gate", startMonth: 2, duration: 0, status: 'baseline', isMilestone: true },
  { id: "8", name: "DD Owner Gate", startMonth: 4.5, duration: 0, status: 'baseline', isMilestone: true },
  { id: "9", name: "Permit Package Preparation", startMonth: 5.5, duration: 0.5, baselineStart: 5.5, baselineDuration: 0.5, status: 'baseline' },
  { id: "10", name: "Permit Submission", startMonth: 6, duration: 1, baselineStart: 6, baselineDuration: 1, status: 'baseline' },
  { id: "11", name: "Permit Approved", startMonth: 7, duration: 0, status: 'baseline', isMilestone: true },
  { id: "12", name: "Long-Lead Procurement", startMonth: 4.5, duration: 6, baselineStart: 4.5, baselineDuration: 6, status: 'baseline' },
  { id: "13", name: "Foundation Work", startMonth: 7.5, duration: 2, baselineStart: 7.5, baselineDuration: 2, status: 'baseline' },
  { id: "14", name: "MEP Rough-In Complete", startMonth: 9.5, duration: 2, baselineStart: 9, baselineDuration: 1.5, status: 'delayed' },
  { id: "15", name: "Finishes", startMonth: 11, duration: 1.5, baselineStart: 10.5, baselineDuration: 1.5, status: 'delayed' },
  { id: "16", name: "Commissioning", startMonth: 12, duration: 0.5, baselineStart: 11.5, baselineDuration: 0.5, status: 'delayed' },
  { id: "17", name: "Substantial Completion", startMonth: 12.5, duration: 0, status: 'baseline', isMilestone: true },
];

const months = [
  "Dec", "Jan", "Feb", "Mar", "Apr", "May", 
  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"
];

export function ScheduleAlignment() {
  const [showBaseline, setShowBaseline] = useState(true);
  const [activeStep, setActiveStep] = useState<'intake' | 'summary'>('intake');
  const [uploadMode, setUploadMode] = useState<'file' | 'manual'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} file(s) uploaded successfully`);
      // Process files here
    }
  };

  const handleWebhookConnect = () => {
    toast.success("Webhook connected successfully");
  };

  const getBarColor = (status: string, isBaseline?: boolean) => {
    if (isBaseline) return "bg-blue-300/70";
    
    switch (status) {
      case 'baseline':
      case 'current':
        return "bg-slate-500";
      case 'delayed':
        return "bg-red-400";
      case 'accelerated':
        return "bg-green-400";
      case 'proposed-pending':
        return "bg-amber-300";
      case 'proposed-accepted':
        return "bg-green-600";
      default:
        return "bg-slate-400";
    }
  };

  const getMilestoneColor = (status: string) => {
    if (status === 'proposed-pending') return "bg-amber-400";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Schedule Alignment</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ingest schedule updates, summarize changes, and reconcile with baseline—with optional re-baselining
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">Baseline v1.0</Badge>
            <span className="text-sm text-muted-foreground">Period: Oct 28 - Nov 4</span>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeStep === 'intake' ? 'default' : 'outline'}
            onClick={() => setActiveStep('intake')}
            className="gap-2"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              activeStep === 'intake' ? 'bg-white text-primary' : 'bg-primary text-white'
            }`}>
              1
            </div>
            Intake
          </Button>
          <Button
            variant={activeStep === 'summary' ? 'default' : 'outline'}
            onClick={() => setActiveStep('summary')}
            className="gap-2"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              activeStep === 'summary' ? 'bg-white text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            Summary & Reconciliation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeStep === 'intake' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Schedule Intake & Parse Header */}
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Schedule Intake & Parse</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Import schedule updates, reports, notes, or any project-related changes. The system will automatically parse and
                  extract schedule claims for reconciliation.
                </p>
              </div>

              {/* Upload Mode Selection */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setUploadMode('file')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    uploadMode === 'file'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="font-semibold mb-1">File Upload</div>
                  <div className="text-sm text-muted-foreground">All file types</div>
                </button>
                <button
                  onClick={() => setUploadMode('manual')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    uploadMode === 'manual'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">+</div>
                  <div className="font-semibold mb-1">Manual Entry</div>
                  <div className="text-sm text-muted-foreground">Type directly</div>
                </button>
              </div>

              {/* File Upload Area */}
              {uploadMode === 'file' && (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/20">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
                    Upload schedule files, reports, documents, notes, or any project-related files. The system will automatically recognize
                    file types and extract schedule information.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground mb-6">
                    <span>Schedules (.mpp, .xer, .xml)</span>
                    <span>Reports (.pdf, .csv, .xlsx)</span>
                    <span>Notes (.txt, .md, .docx)</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".mpp,.xer,.xml,.pdf,.csv,.xlsx,.txt,.md,.docx"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Files
                  </Button>
                </div>
              )}

              {/* Manual Entry Area */}
              {uploadMode === 'manual' && (
                <div className="border-2 border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Manual Schedule Entry</h3>
                  <textarea
                    placeholder="Enter schedule updates, changes, or notes here..."
                    className="w-full h-48 px-4 py-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-end mt-4">
                    <Button>Parse Entry</Button>
                  </div>
                </div>
              )}

              {/* API Webhook Section */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-start gap-3 mb-4">
                  <Link2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Connect API Webhook</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically ingest updates from external systems via webhook URL
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://api.example.com/webhook"
                        className="flex-1 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button onClick={handleWebhookConnect}>Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Previous Alignment Updates */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Previous Alignment Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Recent schedule alignment sessions and their outcomes
                  </p>
                </div>
                <Button variant="outline">View All</Button>
              </div>

              <div className="space-y-4">
                {/* Update Entry 1 */}
                <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Jan 15, 2024</span>
                    </div>
                    <Eye className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-medium mb-3">
                    Permit approval delay +2 weeks, MEP rough-in completed early -3 days
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Items: 5</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>4 accepted</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>1 rejected</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                      <TrendingUp className="h-4 w-4" />
                      <span>+11 days</span>
                    </div>
                  </div>
                </div>

                {/* Update Entry 2 */}
                <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Jan 10, 2024</span>
                    </div>
                    <Eye className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-medium mb-3">
                    Owner milestone updates, Foundation delay +1 week
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Items: 3</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>3 accepted</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>0 rejected</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                      <TrendingUp className="h-4 w-4" />
                      <span>+7 days</span>
                    </div>
                  </div>
                </div>

                {/* Update Entry 3 */}
                <div className="border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Jan 5, 2024</span>
                    </div>
                    <Eye className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-medium mb-3">
                    Design phase completion +5 days, Procurement acceleration -2 days
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Items: 4</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>2 accepted</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span>2 rejected</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground ml-auto">
                      <TrendingUp className="h-4 w-4" />
                      <span>+3 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Current Schedule Overview</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="show-baseline" 
                  checked={showBaseline}
                  onCheckedChange={(checked) => setShowBaseline(checked as boolean)}
                />
                <label htmlFor="show-baseline" className="text-sm cursor-pointer">
                  Show Baseline
                </label>
              </div>
              <Button variant="outline" size="sm">Baseline vs Current</Button>
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="relative">
            {/* Header */}
            <div className="flex border-b bg-muted/30">
              <div className="w-56 flex-shrink-0 px-4 py-3 font-medium text-sm">Task</div>
              <div className="flex-1 flex">
                {months.map((month, i) => (
                  <div 
                    key={i} 
                    className="flex-1 min-w-[90px] px-2 py-3 text-xs font-medium text-center border-l"
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            {scheduleData.map((task, idx) => (
              <div 
                key={idx}
                className="flex border-b hover:bg-muted/20 transition-colors"
              >
                {/* Task Name */}
                <div className="w-56 flex-shrink-0 px-4 py-4 text-sm">
                  {task.name}
                </div>

                {/* Timeline */}
                <div className="flex-1 flex relative" style={{ minHeight: '48px' }}>
                  {/* Grid lines */}
                  {months.map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 min-w-[90px] border-l"
                    ></div>
                  ))}

                  {/* Baseline Bar (if exists and enabled) */}
                  {showBaseline && task.baselineStart !== undefined && !task.isMilestone && (
                    <div
                      className={`absolute ${getBarColor(task.status, true)} rounded opacity-60`}
                      style={{
                        left: `${(task.baselineStart / 12) * 100}%`,
                        width: `${(task.baselineDuration! / 12) * 100}%`,
                        top: '12px',
                        height: '24px',
                      }}
                    />
                  )}

                  {/* Current/Actual Bar or Milestone */}
                  {task.isMilestone ? (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 z-10"
                      style={{
                        left: `${(task.startMonth / 12) * 100}%`,
                      }}
                    >
                      <div className="relative">
                        <div className={`w-3 h-3 ${getMilestoneColor(task.status)} rotate-45`}></div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground">
                          {task.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`absolute ${getBarColor(task.status)} rounded shadow-sm z-10`}
                      style={{
                        left: `${(task.startMonth / 12) * 100}%`,
                        width: `${(task.duration / 12) * 100}%`,
                        top: showBaseline && task.baselineStart !== undefined ? '18px' : '12px',
                        height: '20px',
                      }}
                    >
                      {/* Show delayed extension if applicable */}
                      {task.status === 'delayed' && showBaseline && task.baselineStart !== undefined && (
                        <div
                          className="absolute bg-blue-200 rounded-r h-full"
                          style={{
                            right: 0,
                            width: `${((task.startMonth + task.duration - (task.baselineStart + task.baselineDuration!)) / task.duration) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-blue-300/70 rounded"></div>
              <span>Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-slate-500 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-red-400 rounded"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-400 rounded"></div>
              <span>Accelerated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-amber-300 rounded"></div>
              <span>Proposed (Pending)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-600 rounded"></div>
              <span>Proposed (Accepted)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rotate-45"></div>
              <span>Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rotate-45"></div>
              <span>Proposed Milestone</span>
            </div>
          </div>
        </Card>
        )}
      </div>
    </div>
  );
}

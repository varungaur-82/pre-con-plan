import { DataEngine } from "./DataEngine";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, TrendingUp, Calendar, DollarSign, 
  Target, AlertCircle, CheckCircle2, Upload, Send,
  FileText, BarChart3, Clock, Users, PanelRightClose, PanelRightOpen,
  TrendingDown, Flag, Banknote, Scale, Clipboard, Wrench, Zap, StickyNote, FolderOpen, File,
  CalendarIcon
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTabContext } from "@/contexts/TabContext";
import { DesignStudio } from "./DesignStudio";
import { AutomationHub } from "./AutomationHub";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [selectedCostView, setSelectedCostView] = useState("s-curve");
  const [currentTab, setCurrentTab] = useState("overview");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<"7d" | "30d" | "quarter" | "custom">("30d");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const projectName = projectId === "1" ? "NYC Tower" : 
                      projectId === "2" ? "Riverside Apartments" : "New Project";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    console.log("Sending message to Co-Pilot...");

    try {
      const pageContext = {
        currentPage: currentTab,
        projectData: {
          id: projectId,
          name: projectName,
        }
      };

      console.log("Page context:", pageContext);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/copilot-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
            pageContext,
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Payment Required",
            description: "Please add credits to your workspace.",
            variant: "destructive",
          });
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        toast({
          title: "Error",
          description: `Failed to get response: ${response.status}`,
          variant: "destructive",
        });
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantMessage = "";
      let streamDone = false;

      // Add empty assistant message that will be updated
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI assistant.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1)); // Remove empty assistant message
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const riskData = {
    labor: {
      title: "Labor shortage",
      owner: "R. Davis",
      dueDate: "2024-03-15",
      impact: "Low",
      probability: "High",
      cost: "$500k",
      timeline: "7d",
      impactBadgeClass: "bg-green-100 text-green-800 hover:bg-green-100",
      impactBadgeVariant: undefined,
      probabilityBadgeClass: undefined,
      probabilityBadgeVariant: "destructive" as const,
      description: "Risk of labor shortage affecting project timeline and costs. Mitigation strategies include pre-qualified subcontractor backup lists and early contract commitments."
    },
    permit: {
      title: "Permit delay risk",
      owner: "M. Johnson",
      dueDate: "2024-02-01",
      impact: "Medium",
      probability: "Medium",
      cost: "14d",
      timeline: "",
      impactBadgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      impactBadgeVariant: undefined,
      probabilityBadgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      probabilityBadgeVariant: undefined,
      description: "Potential delays in permit approvals could impact project schedule. Active coordination with regulatory authorities and expedited review processes are in place."
    },
    steel: {
      title: "Steel escalation +12%",
      owner: "J. Smith",
      dueDate: "2024-01-20",
      impact: "High",
      probability: "High",
      cost: "$2.5M",
      timeline: "",
      impactBadgeClass: undefined,
      impactBadgeVariant: "destructive" as const,
      probabilityBadgeClass: undefined,
      probabilityBadgeVariant: "destructive" as const,
      description: "Market volatility has caused a 12% increase in steel prices. Contingency budget allocation and alternative material sourcing are being evaluated to mitigate cost impact."
    }
  };

  const kpiData = {
    "7d": {
      label: "Last 7 days",
      newCommitments: { count: 2, value: "$1.2M" },
      approvedChangeOrders: { count: 1, value: "$600k" },
      invoicesProcessed: { count: 5, value: "$1.8M" },
      budgetTransfers: { count: 1, value: "$200k" },
      scheduleMovement: { count: 0, value: "-2d" },
      milestonesUpdated: { count: 0, value: "+0" }
    },
    "30d": {
      label: "Last 30 days",
      newCommitments: { count: 4, value: "$2.5M" },
      approvedChangeOrders: { count: 3, value: "$1.3M" },
      invoicesProcessed: { count: 12, value: "$3.8M" },
      budgetTransfers: { count: 2, value: "$500k" },
      scheduleMovement: { count: 1, value: "-5d" },
      milestonesUpdated: { count: 1, value: "+1" }
    },
    "quarter": {
      label: "This Quarter",
      newCommitments: { count: 15, value: "$8.5M" },
      approvedChangeOrders: { count: 9, value: "$4.2M" },
      invoicesProcessed: { count: 38, value: "$12.5M" },
      budgetTransfers: { count: 5, value: "$1.8M" },
      scheduleMovement: { count: 3, value: "-12d" },
      milestonesUpdated: { count: 4, value: "+4" }
    },
    "custom": {
      label: "Custom Range",
      newCommitments: { count: 0, value: "$0" },
      approvedChangeOrders: { count: 0, value: "$0" },
      invoicesProcessed: { count: 0, value: "$0" },
      budgetTransfers: { count: 0, value: "$0" },
      scheduleMovement: { count: 0, value: "0d" },
      milestonesUpdated: { count: 0, value: "+0" }
    }
  };

  const currentKpiData = kpiData[timePeriod];

  const handleCustomDateApply = () => {
    if (customDateRange.from && customDateRange.to) {
      setTimePeriod("custom");
      setIsCustomDialogOpen(false);
      toast({
        title: "Custom date range applied",
        description: `${format(customDateRange.from, "PPP")} - ${format(customDateRange.to, "PPP")}`,
      });
    } else {
      toast({
        title: "Select both dates",
        description: "Please select a start and end date",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="flex h-full">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isAiSidebarOpen ? 'pr-96' : ''} overflow-y-auto`}>
        {/* Top Navigation Tabs */}
        <div className="bg-card border-b">
          <div className="container px-6">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="overview" className="flex-1" onValueChange={setCurrentTab}>
                <div className="flex items-center justify-between">
                  <TabsList className="bg-transparent border-b-0 h-auto p-0 space-x-1">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="design-studio" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Design Studio
                    </TabsTrigger>
                    <TabsTrigger 
                      value="5d" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      5D
                    </TabsTrigger>
                    <TabsTrigger 
                      value="automation" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Automation Hub
                    </TabsTrigger>
                    <TabsTrigger 
                      value="procurement" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Procurement
                    </TabsTrigger>
                    <TabsTrigger 
                      value="data" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-construction-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                      Data Engine
                    </TabsTrigger>
                  </TabsList>

                  {/* Toggle AI Assistant Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                    className="ml-4"
                  >
                    {isAiSidebarOpen ? (
                      <>
                        <PanelRightClose className="h-4 w-4 mr-2" />
                        Hide AI
                      </>
                    ) : (
                      <>
                        <PanelRightOpen className="h-4 w-4 mr-2" />
                        Co-Pilot
                      </>
                    )}
                  </Button>
                </div>

                {/* Overview Tab Content */}
                <TabsContent value="overview" className="mt-0">
              <div className="container px-6 py-8">
                {/* Welcome Banner */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                      SC
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">
                        Welcome back, Sarah Chen
                      </h1>
                      <p className="text-sm text-muted-foreground mb-2">Project Manager (PM)</p>
                      <p className="text-sm text-muted-foreground">
                        Your project dashboard is updated with the latest cost data and schedule insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What Changed This Period */}
                <Card className="mb-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle>What Changed This Period?</CardTitle>
                        <span className="text-sm text-muted-foreground">{currentKpiData.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant={timePeriod === "7d" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimePeriod("7d")}
                        >
                          7d
                        </Button>
                        <Button 
                          variant={timePeriod === "30d" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimePeriod("30d")}
                        >
                          30d
                        </Button>
                        <Button 
                          variant={timePeriod === "quarter" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTimePeriod("quarter")}
                        >
                          Quarter
                        </Button>
                        <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant={timePeriod === "custom" ? "default" : "outline"} 
                              size="sm"
                            >
                              Custom
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Select Custom Date Range</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !customDateRange.from && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {customDateRange.from ? format(customDateRange.from, "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                      mode="single"
                                      selected={customDateRange.from}
                                      onSelect={(date) => setCustomDateRange({ ...customDateRange, from: date })}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">End Date</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !customDateRange.to && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {customDateRange.to ? format(customDateRange.to, "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                      mode="single"
                                      selected={customDateRange.to}
                                      onSelect={(date) => setCustomDateRange({ ...customDateRange, to: date })}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <Button onClick={handleCustomDateApply} className="w-full">
                                Apply Date Range
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {/* New Commitments */}
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">{currentKpiData.newCommitments.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">New Commitments</div>
                        <div className="text-lg font-bold">{currentKpiData.newCommitments.value}</div>
                      </div>

                      {/* Approved Change Orders */}
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">{currentKpiData.approvedChangeOrders.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Approved Change Orders</div>
                        <div className="text-lg font-bold">{currentKpiData.approvedChangeOrders.value}</div>
                      </div>

                      {/* Invoices Processed */}
                      <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">{currentKpiData.invoicesProcessed.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Invoices Processed</div>
                        <div className="text-lg font-bold">{currentKpiData.invoicesProcessed.value}</div>
                      </div>

                      {/* Budget Transfers */}
                      <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-600 mb-2">
                          <span className="text-sm font-semibold">→ {currentKpiData.budgetTransfers.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Budget Transfers</div>
                        <div className="text-lg font-bold">{currentKpiData.budgetTransfers.value}</div>
                      </div>

                      {/* Schedule Movement */}
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-red-600 mb-2">
                          <span className="text-sm font-semibold">↘ {currentKpiData.scheduleMovement.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Schedule Movement</div>
                        <div className="text-lg font-bold">{currentKpiData.scheduleMovement.value}</div>
                      </div>

                      {/* Milestones Updated */}
                      <div className="bg-teal-50 dark:bg-teal-950/20 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-teal-600 mb-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">{currentKpiData.milestonesUpdated.count}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Milestones Updated</div>
                        <div className="text-lg font-bold">{currentKpiData.milestonesUpdated.value}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-4 mb-4">
                  {/* Left Column - Project Details & Status */}
                  <div className="space-y-4">
                    {/* Project Details */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 pt-0">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-semibold">Downtown Office Complex</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-semibold">PRJ-2024-001</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-semibold">Commercial Office</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-semibold">125,000 sq ft</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-semibold">$50.0M</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-semibold">2024-12-15</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Status */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Project Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 pt-0">
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Overall Health:</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Track</Badge>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Budget Status:</span>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Within Budget</Badge>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">Schedule Status:</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">On Time</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Executive Summary */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <CardTitle>Executive Summary</CardTitle>
                      <span className="text-sm text-muted-foreground">↗ Last updated 2024-01-15</span>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-0">
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Cost & Schedule:</span>
                        <span className="text-right font-medium">Under budget by $2.1M; Running 5 days behind schedule</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Current Phase:</span>
                        <span className="font-medium">Foundation & Structure</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Scope Changes:</span>
                        <span className="text-right font-medium">8 approved ($4.2M), 3 pending ($1.5M)</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Cashflow:</span>
                        <span className="text-right font-medium">This period $3.8M Actual / $4.2M Planned; This period 90% of Planned</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Last Completed:</span>
                        <span className="font-medium">Foundation Complete (2024-01-10)</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Next Milestone:</span>
                        <span className="font-medium">Steel Frame Start (2024-01-25)</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Decision Needed:</span>
                        <span className="text-right font-medium text-red-600">Approve steel escalation contingency (due 2024-01-20, J. Smith)</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Signals:</span>
                        <span className="text-right font-medium">SPI: 0.95 (↓), CPI: 1.02 (↑), Market: Steel +12% (↑)</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Schedule and Cost Overview */}
                <div className="grid lg:grid-cols-3 gap-4 mb-4">
                  {/* Schedule Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Schedule Overview</CardTitle>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B0</Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B1</Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">B2</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300 px-4 py-2 rounded text-sm">
                        Running 5 days behind schedule
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Baseline</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Actual %</span>
                          </div>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={[
                            { month: 'Jan 25', baseline: 5, actual: 5 },
                            { month: 'Feb 25', baseline: 12, actual: 10 },
                            { month: 'Mar 25', baseline: 25, actual: 20 },
                            { month: 'Apr 25', baseline: 45, actual: 38 },
                            { month: 'May 25', baseline: 65, actual: 58 },
                            { month: 'Jun 25', baseline: 78, actual: 72 },
                            { month: 'Jul 25', baseline: 88, actual: 83 },
                            { month: 'Aug 25', baseline: 100, actual: 95 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                              label={{ value: '%', angle: 0, position: 'top' }}
                            />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="baseline" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ fill: '#3b82f6', r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ fill: '#10b981', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Upcoming Milestones</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Foundation Complete</span>
                            <span className="text-muted-foreground">2024-01-10</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Steel Frame Start</span>
                            <span className="text-green-600">2024-01-25 -2d</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Steel Frame Complete</span>
                            <span className="text-red-600">2024-03-15 +3d</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Overview */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Cost Overview</CardTitle>
                        <select 
                          className="text-sm border rounded px-2 py-1 bg-background"
                          value={selectedCostView}
                          onChange={(e) => setSelectedCostView(e.target.value)}
                        >
                          <option value="s-curve">📊 S-Curve</option>
                          <option value="contingency-drawdown">💰 Contingency Drawdown</option>
                          <option value="cost-position">🏁 Cost Position</option>
                          <option value="cash-flow">💵 Cash Flow</option>
                          <option value="contingency-balance">⚖️ Contingency Balance</option>
                          <option value="change-orders">📋 Change Orders</option>
                          <option value="trade-budget">🔧 Trade Budget</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Common metrics for all views */}
                      <div className="grid grid-cols-5 gap-4 pb-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Budget</div>
                          <div className="text-xl font-bold">$45.8M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Commitments</div>
                          <div className="text-xl font-bold">$41.9M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Invoiced</div>
                          <div className="text-xl font-bold">$23.0M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Forecast</div>
                          <div className="text-xl font-bold">$42.6M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Contingency</div>
                          <div className="text-xl font-bold">$2.3M</div>
                        </div>
                      </div>

                      {/* S-Curve View */}
                      {selectedCostView === "s-curve" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div>
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <span className="ml-2 font-semibold text-red-600">91%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <span className="ml-2 font-semibold text-green-600">93%</span>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-xs flex-wrap">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Approved Budget</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span>Committed</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Invoiced</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span>Planned Cashflow</span>
                              </div>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={[
                                { month: 'Jan 25', budget: 45800000, committed: 2000000, invoiced: 1500000, cashflow: 2500000 },
                                { month: 'Feb 25', budget: 45800000, committed: 5000000, invoiced: 3500000, cashflow: 6000000 },
                                { month: 'Mar 25', budget: 45800000, committed: 10000000, invoiced: 7000000, cashflow: 12000000 },
                                { month: 'Apr 25', budget: 45800000, committed: 18000000, invoiced: 12000000, cashflow: 20000000 },
                                { month: 'May 25', budget: 45800000, committed: 27000000, invoiced: 16000000, cashflow: 30000000 },
                                { month: 'Jun 25', budget: 45800000, committed: 35000000, invoiced: 20000000, cashflow: 38000000 },
                                { month: 'Jul 25', budget: 45800000, committed: 40000000, invoiced: 22000000, cashflow: 43000000 },
                                { month: 'Aug 25', budget: 45800000, committed: 41900000, invoiced: 23000000, cashflow: 45800000 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="budget" 
                                  stroke="#3b82f6" 
                                  strokeWidth={2}
                                  dot={{ fill: '#3b82f6', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="cashflow" 
                                  stroke="#06b6d4" 
                                  strokeWidth={2}
                                  dot={{ fill: '#06b6d4', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="committed" 
                                  stroke="#f97316" 
                                  strokeWidth={2}
                                  dot={{ fill: '#f97316', r: 3 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="invoiced" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  dot={{ fill: '#10b981', r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}

                      {/* Contingency Drawdown View */}
                      {selectedCostView === "contingency-drawdown" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={[
                                { month: 'Jan 25', percentage: 100 },
                                { month: 'Feb 25', percentage: 98 },
                                { month: 'Mar 25', percentage: 95 },
                                { month: 'Apr 25', percentage: 92 },
                                { month: 'May 25', percentage: 88 },
                                { month: 'Jun 25', percentage: 84 },
                                { month: 'Jul 25', percentage: 80 },
                                { month: 'Aug 25', percentage: 76 }
                              ]}>
                                <defs>
                                  <linearGradient id="contingencyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  domain={[0, 100]}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `${value}%`}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="percentage" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  fill="url(#contingencyGradient)"
                                  dot={{ fill: '#10b981', r: 4 }}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                            <p className="text-center text-sm text-muted-foreground">Contingency Drawdown Over Time</p>
                          </div>
                        </>
                      )}

                      {/* Cost Position View */}
                      {selectedCostView === "cost-position" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Total Cost Position – Funding vs EAC</h4>
                              <span className="text-sm text-muted-foreground">USD</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { name: 'Original Budget', amount: 22000000 },
                                  { name: 'Approved Changes', amount: 1800000 },
                                  { name: 'Current Budget', amount: 23800000 },
                                  { name: 'Committed', amount: 18900000 },
                                  { name: 'Invoiced', amount: 10500000 },
                                  { name: 'Forecast to Complete', amount: 6400000 },
                                  { name: 'EAC', amount: 16900000 }
                                ]}
                                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="name" 
                                  angle={-45}
                                  textAnchor="end"
                                  height={80}
                                  interval={0}
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar 
                                  dataKey="amount" 
                                  fill="#3b82f6" 
                                  radius={[4, 4, 0, 0]}
                                  label={{ 
                                    position: 'top', 
                                    formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
                                    fill: 'hsl(var(--foreground))',
                                    fontSize: 11
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-2 text-xs">
                              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                              <span className="text-muted-foreground">Amount</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Cash Flow View */}
                      {selectedCostView === "cash-flow" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Cash Flow – Plan vs Actual vs Forecast</h4>
                              <span className="text-sm text-muted-foreground">Monthly + cumulative S-curves</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { month: '01', actual: 2000000, forecast: 1800000, planned: 2500000, cumActual: 2000000, cumPlan: 2500000 },
                                  { month: '02', actual: 3500000, forecast: 3200000, planned: 4000000, cumActual: 5500000, cumPlan: 6500000 },
                                  { month: '03', actual: 5000000, forecast: 4500000, planned: 6000000, cumActual: 10500000, cumPlan: 12500000 },
                                  { month: '04', actual: 7000000, forecast: 6500000, planned: 8000000, cumActual: 17500000, cumPlan: 20500000 },
                                  { month: '05', actual: 9000000, forecast: 8500000, planned: 10000000, cumActual: 26500000, cumPlan: 30500000 },
                                  { month: '06', actual: 11000000, forecast: 10500000, planned: 12000000, cumActual: 37500000, cumPlan: 42500000 },
                                  { month: '07', actual: 13000000, forecast: 12500000, planned: 14000000, cumActual: 50500000, cumPlan: 56500000 },
                                  { month: '08', actual: 0, forecast: 15000000, planned: 16000000, cumActual: 50500000, cumPlan: 72500000 }
                                ]}
                                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  yAxisId="left"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                                />
                                <YAxis 
                                  yAxisId="right"
                                  orientation="right"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar yAxisId="left" dataKey="actual" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="forecast" fill="#93c5fd" name="Forecast" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey="planned" fill="#bfdbfe" name="Planned" radius={[4, 4, 0, 0]} />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="cumActual" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                  dot={{ fill: '#10b981', r: 3 }}
                                  name="Cum Actual"
                                />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="cumPlan" 
                                  stroke="#374151" 
                                  strokeWidth={2}
                                  dot={{ fill: '#374151', r: 3 }}
                                  name="Cum Plan"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                <span>Actual</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                <span>Cum Actual</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                <span>Cum Plan</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                                <span>Forecast</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                                <span>Planned</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Contingency Balance View */}
                      {selectedCostView === "contingency-balance" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Contingency & Allowances – Balance & Burn</h4>
                              <span className="text-sm text-muted-foreground">With pending exposure</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { category: 'Original\nContingency', balance: 2500000, burned: 0 },
                                  { category: 'Weather\nDelays', balance: 0, burned: -400000 },
                                  { category: 'Steel\nEscalation', balance: 0, burned: -500000 },
                                  { category: 'Design\nChanges', balance: 0, burned: -300000 },
                                  { category: 'Remaining', balance: 1300000, burned: 0 }
                                ]}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 120, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  type="number"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                  domain={[-800000, 3000000]}
                                />
                                <YAxis 
                                  dataKey="category"
                                  type="category"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  width={110}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(Math.abs(value) / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar 
                                  dataKey="balance" 
                                  fill="#f59e0b" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                  dataKey="burned" 
                                  fill="#fbbf24" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}

                      {/* Change Orders View */}
                      {selectedCostView === "change-orders" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Change Orders & Cost Exposure Over Time</h4>
                              <span className="text-sm text-muted-foreground">Monthly + cumulative</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { month: '01', approved: 150000, pending: 50000, cumulative: 200000 },
                                  { month: '02', approved: 180000, pending: 70000, cumulative: 450000 },
                                  { month: '03', approved: 120000, pending: 40000, cumulative: 610000 },
                                  { month: '04', approved: 280000, pending: 120000, cumulative: 1010000 },
                                  { month: '05', approved: 160000, pending: 60000, cumulative: 1230000 },
                                  { month: '06', approved: 200000, pending: 80000, cumulative: 1510000 },
                                  { month: '07', approved: 150000, pending: 50000, cumulative: 1710000 },
                                  { month: '08', approved: 180000, pending: 90000, cumulative: 1980000 }
                                ]}
                                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="month" 
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis 
                                  yAxisId="left"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <YAxis 
                                  yAxisId="right"
                                  orientation="right"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar yAxisId="left" dataKey="approved" stackId="a" fill="#10b981" name="Approved" radius={[0, 0, 0, 0]} />
                                <Bar yAxisId="left" dataKey="pending" stackId="a" fill="#f97316" name="Pending" radius={[4, 4, 0, 0]} />
                                <Line 
                                  yAxisId="right"
                                  type="monotone" 
                                  dataKey="cumulative" 
                                  stroke="#374151" 
                                  strokeWidth={2}
                                  dot={{ fill: '#374151', r: 3 }}
                                  name="Cumulative"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                                <span>Approved</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                                <span>Pending</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                <span>Cumulative</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Trade Budget View */}
                      {selectedCostView === "trade-budget" && (
                        <>
                          <div className="flex items-center gap-6 text-sm pb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Commit/Budget:</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">91%</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Forecast/Budget:</span>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">93%</Badge>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Under budget by $3.2M</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">Budget vs Commitments by Trade (Variance Focus)</h4>
                              <span className="text-sm text-muted-foreground">Sort by variance</span>
                            </div>
                            <ResponsiveContainer width="100%" height={350}>
                              <BarChart 
                                data={[
                                  { trade: 'Steel', budget: 0, committed: 8500000, budgetStart: 0, variance: 500000, forecast: 0 },
                                  { trade: 'Concrete', budget: 0, committed: 5200000, budgetStart: 0, variance: 300000, forecast: 0 },
                                  { trade: 'MEP', budget: 0, committed: 5800000, budgetStart: 0, variance: -200000, forecast: 0 },
                                  { trade: 'Finishes', budget: 0, committed: 4200000, budgetStart: 0, variance: -300000, forecast: 0 },
                                  { trade: 'Site Work', budget: 2100000, committed: 0, budgetStart: 0, variance: -800000, forecast: 0 }
                                ]}
                                layout="vertical"
                                margin={{ top: 20, right: 80, left: 80, bottom: 40 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  type="number"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                  domain={[-3000000, 10000000]}
                                />
                                <YAxis 
                                  dataKey="trade"
                                  type="category"
                                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                                  axisLine={{ stroke: 'hsl(var(--border))' }}
                                  width={70}
                                />
                                <Tooltip 
                                  formatter={(value: number) => `$${(Math.abs(value) / 1000000).toFixed(1)}M`}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                  }}
                                />
                                <Bar 
                                  dataKey="budget" 
                                  fill="#d1d5db" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                  dataKey="committed" 
                                  fill="#3b82f6" 
                                  stackId="a"
                                  radius={[0, 4, 4, 0]}
                                  label={{ 
                                    position: 'right', 
                                    formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
                                    fill: 'hsl(var(--foreground))',
                                    fontSize: 10
                                  }}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-gray-300"></div>
                                <span>Budget</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                <span>Committed</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                <span>Forecast</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                <span>Variance</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Risks */}
                <Card>
                    <CardHeader>
                      <CardTitle>Risks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid lg:grid-cols-2 gap-4">
                        {/* Risk Heat Map */}
                        <div>
                          <h4 className="font-semibold mb-3">Risk Heat Map</h4>
                          <div className="space-y-1">
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">HI</div>
                              <div 
                                className="bg-green-100 dark:bg-green-950/30 p-2 text-center rounded relative cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedRisk('labor')}
                              >
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div 
                                className="bg-red-100 dark:bg-red-950/30 p-2 text-center rounded relative cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedRisk('steel')}
                              >
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">MI</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div 
                                className="bg-yellow-100 dark:bg-yellow-950/30 p-2 text-center rounded relative cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedRisk('permit')}
                              >
                                1
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                              </div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs">
                              <div className="text-right pr-2 py-2 text-muted-foreground">LI</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                              <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center rounded">0</div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground text-center pt-2">
                              <div></div>
                              <div>LP</div>
                              <div>MP</div>
                              <div>HP</div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                            <div>HI=High Impact, MI=Medium Impact, LI=Low Impact</div>
                            <div>LP=Low Probability, MP=Medium Probability, HP=High Probability</div>
                          </div>
                          <div className="mt-3 flex gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-100 dark:bg-green-950/30 rounded"></div>
                              <span>Green (Low)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-950/30 rounded"></div>
                              <span>Amber (Medium)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span>Active Risk</span>
                            </div>
                          </div>
                        </div>

                        {/* Risk Summary */}
                        <div>
                          <h4 className="font-semibold mb-3">Risk Summary</h4>
                          {!selectedRisk ? (
                            <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground">
                              Select a cell to see details here.
                            </div>
                          ) : (
                            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                              <div>
                                <h5 className="font-semibold text-base mb-1">
                                  {riskData[selectedRisk as keyof typeof riskData].title}
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  {riskData[selectedRisk as keyof typeof riskData].owner} • Due {riskData[selectedRisk as keyof typeof riskData].dueDate}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant={riskData[selectedRisk as keyof typeof riskData].impactBadgeVariant as any}
                                  className={riskData[selectedRisk as keyof typeof riskData].impactBadgeClass}
                                >
                                  {riskData[selectedRisk as keyof typeof riskData].impact}
                                </Badge>
                                <Badge 
                                  variant={riskData[selectedRisk as keyof typeof riskData].probabilityBadgeVariant as any}
                                  className={riskData[selectedRisk as keyof typeof riskData].probabilityBadgeClass}
                                >
                                  {riskData[selectedRisk as keyof typeof riskData].probability}
                                </Badge>
                                <span className="font-semibold">{riskData[selectedRisk as keyof typeof riskData].cost}</span>
                                {riskData[selectedRisk as keyof typeof riskData].timeline && (
                                  <span className="text-muted-foreground">{riskData[selectedRisk as keyof typeof riskData].timeline}</span>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {riskData[selectedRisk as keyof typeof riskData].description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    </CardContent>
                  </Card>

                  {/* Activity, Notes, Recent Files and Quick Actions */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Activity */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Zap className="h-4 w-4" />
                            Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Budget approval received</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Foundation milestone completed</p>
                                <p className="text-xs text-muted-foreground">4 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">New drawings uploaded</p>
                                <p className="text-xs text-muted-foreground">6 hours ago</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notes and Recent Files Combined */}
                      <div className="space-y-6">
                        {/* Notes */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <StickyNote className="h-4 w-4" />
                              Notes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Input 
                              placeholder="Quick notes..." 
                              className="border-muted"
                            />
                          </CardContent>
                        </Card>

                        {/* Recent Files */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <FolderOpen className="h-4 w-4" />
                              Recent Files
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 flex-1">
                                  <File className="h-4 w-4 text-red-500" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Project_Overview.pdf</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                  </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                              </div>
                              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 flex-1">
                                  <BarChart3 className="h-4 w-4 text-green-500" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Cost_Analysis_Report.xlsx</p>
                                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                                  </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                              </div>
                              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 flex-1">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Schedule_Milestones.docx</p>
                                    <p className="text-xs text-muted-foreground">1 day ago</p>
                                  </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                              </div>
                              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 flex-1">
                                  <BarChart3 className="h-4 w-4 text-orange-500" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Risk_Assessment.pptx</p>
                                    <p className="text-xs text-muted-foreground">2 days ago</p>
                                  </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <FileText className="h-4 w-4 text-red-600" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Set Alerts
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Users className="h-4 w-4 text-gray-600" />
                        Configure Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Design Studio Tab */}
            <TabsContent value="design-studio" className="mt-0 h-full">
              <DesignStudio />
            </TabsContent>

            {/* 5D Tab */}
            <TabsContent value="5d" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">5D</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Automation Hub Tab */}
            <TabsContent value="automation" className="mt-0">
              <AutomationHub />
            </TabsContent>

            {/* Procurement Tab */}
            <TabsContent value="procurement" className="mt-0">
              <div className="container px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-muted-foreground mb-4">Procurement</h2>
                <p className="text-muted-foreground">Content coming soon...</p>
              </div>
            </TabsContent>

            {/* Data Engine Tab */}
            <TabsContent value="data" className="mt-0 h-[calc(100vh-200px)]">
              <DataEngine />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </div>

    {/* AI Assistant Right Sidebar */}
    <div 
      className={`fixed right-0 top-0 w-96 bg-background border-l shadow-lg transition-transform duration-300 flex flex-col ${
        isAiSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ height: '100vh', maxWidth: '384px', zIndex: 40 }}
    >
      {/* Header */}
      <div className="p-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAiSidebarOpen(false)}
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <>
            {/* Welcome Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm">
                    Hello! I'm your AI Co-Pilot. I'm context-aware and can help you with insights specific to the{" "}
                    <strong>{currentTab === "overview" ? "Overview" : 
                             currentTab === "design-studio" ? "Design Studio" :
                             currentTab === "5d" ? "5D Cost Management" :
                             currentTab === "automation" ? "Automation Hub" :
                             currentTab === "procurement" ? "Procurement" :
                             currentTab === "data" ? "Data Engine" : "current"}</strong> page.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">Just now</span>
              </div>
            </div>

            {/* Dynamic Suggested Prompts based on current page */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-2">
                Try asking about this page:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentTab === "overview" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Analyze the 5-day schedule delay and suggest recovery actions")}
                    >
                      Analyze schedule delay
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("What are the top 3 risks that need immediate attention?")}
                    >
                      Top 3 risks
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Generate an executive summary for stakeholders")}
                    >
                      Executive summary
                    </Button>
                  </>
                )}
                {currentTab === "5d" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("What's our current Cost Performance Index (CPI)?")}
                    >
                      Show CPI
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Forecast final project cost based on current trends")}
                    >
                      Forecast costs
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Identify cost centers exceeding budget")}
                    >
                      Budget overruns
                    </Button>
                  </>
                )}
                {currentTab === "automation" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Help me create a monthly executive report")}
                    >
                      Create report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Which template should I use for stakeholder updates?")}
                    >
                      Suggest template
                    </Button>
                  </>
                )}
                {currentTab === "design-studio" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Summarize open RFIs and their priority")}
                    >
                      Open RFIs
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("What are the latest clash detection findings?")}
                    >
                      Clash detection
                    </Button>
                  </>
                )}
                {currentTab === "procurement" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Show procurement items at risk")}
                    >
                      Items at risk
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Which vendors are causing delays?")}
                    >
                      Vendor delays
                    </Button>
                  </>
                )}
                {currentTab === "data" && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Analyze project data trends")}
                    >
                      Data trends
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs rounded-full border-construction-primary/20 hover:bg-construction-primary/10"
                      onClick={() => handleSuggestedPrompt("Show me correlations between cost and schedule")}
                    >
                      Cost/schedule correlation
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className="flex gap-3">
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}
                <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                  <div className={`rounded-2xl p-3 ${
                    message.role === "user" 
                      ? "bg-construction-primary text-white rounded-tr-sm ml-8" 
                      : "bg-muted rounded-tl-sm"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-construction-primary to-construction-accent flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2 items-end">
          <Textarea 
            placeholder={`Ask about ${currentTab === "overview" ? "project health" : 
                         currentTab === "5d" ? "costs & budget" :
                         currentTab === "automation" ? "reports" :
                         currentTab === "design-studio" ? "design" :
                         currentTab === "procurement" ? "procurement" :
                         currentTab === "data" ? "data" : "your project"}...`}
            className="min-h-[44px] max-h-[120px] resize-none rounded-xl"
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            className="h-11 w-11 rounded-xl bg-construction-primary hover:bg-construction-primary/90 shrink-0"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  </div>
</div>
  );
}
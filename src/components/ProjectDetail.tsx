import { DataEngine } from "./DataEngine";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, TrendingUp, Calendar, DollarSign, 
  Target, AlertCircle, CheckCircle2, Upload, Send,
  FileText, BarChart3, Clock, Users, PanelRightClose, PanelRightOpen,
  TrendingDown, Flag, Banknote, Scale, Clipboard, Wrench, Zap, StickyNote, FolderOpen, File,
  CalendarIcon, ChevronRight, ChevronUp, ChevronDown, ChevronLeft
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
import { useTabContext } from "@/contexts/TabContext";
import { DesignStudio } from "./DesignStudio";
import { AutomationHub } from "./AutomationHub";
import { EstimateGenerator } from "./EstimateGenerator";
import { CompareBudgets } from "./CompareBudgets";
import { BasisOfEstimate } from "./BasisOfEstimate";
import { FiveDSchedule } from "./FiveDSchedule";

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
  const [designOptionsGenerated, setDesignOptionsGenerated] = useState(false);
  const [expandedDesignOption, setExpandedDesignOption] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<{[key: number]: string}>({});
  const [isDesignSidebarCollapsed, setIsDesignSidebarCollapsed] = useState(false);
  const [selectedDesignOption, setSelectedDesignOption] = useState<number | null>(null);
  const [activeEstimationModule, setActiveEstimationModule] = useState<"overview" | "generator" | "compare" | "basis">("overview");
  const [active5DView, setActive5DView] = useState<"t1" | "t2">("t1");
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
                  <div className="grid lg:grid-cols-3 gap-4 mt-6">
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
            <TabsContent value="5d" className="mt-0 h-full">
              {/* Sub-navigation for 5D */}
              <div className="border-b bg-card px-6 py-3">
                <div className="flex gap-2">
                  <Button 
                    variant={active5DView === "t1" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setActive5DView("t1")}
                  >
                    T1 - 5D Estimation
                  </Button>
                  <Button 
                    variant={active5DView === "t2" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setActive5DView("t2")}
                  >
                    T2 - 5D Schedule
                  </Button>
                </div>
              </div>

              {/* T1 Content - Current 5D page */}
              {active5DView === "t1" && (
              <div className="flex h-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  {!selectedDesignOption ? (
                    <>
                      {/* Upload Band */}
                      <div className="border-b bg-card px-8 py-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Upload a design (DWG, IFC, PDF, DXF, RVT) to start.
                          </p>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline"
                              onClick={() => document.getElementById('5d-file-input')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Design
                            </Button>
                            <Button 
                              onClick={() => {
                                const fileInput = document.getElementById('5d-file-input') as HTMLInputElement;
                                if (!fileInput?.files?.length) {
                                  toast({
                                    title: "No File Uploaded",
                                    description: "Please upload a design file first.",
                                    variant: "destructive",
                                  });
                                } else {
                                  setDesignOptionsGenerated(true);
                                  toast({
                                    title: "Options Generated",
                                    description: "Generated 3 design options successfully.",
                                  });
                                }
                              }}
                              className="bg-construction-success hover:bg-construction-success/90"
                            >
                              Generate Options
                            </Button>
                            <input
                              id="5d-file-input"
                              type="file"
                              accept=".dwg,.ifc,.pdf,.dxf,.rvt"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  toast({
                                    title: "File Uploaded",
                                    description: `${file.name} has been uploaded successfully.`,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-8 overflow-y-auto">
                        <h2 className="text-2xl font-bold text-foreground mb-2">5D Cost Management</h2>
                        <p className="text-muted-foreground mb-6">
                          Upload design files and generate cost estimates with multiple options.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 5D Estimation Modules Header */}
                      <div className="p-6 border-b bg-card">
                        <div className="flex items-center justify-between mb-4">
                          <h1 className="text-2xl font-bold">5D Estimation Modules</h1>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedDesignOption(null)}>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Options
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant={activeEstimationModule === "overview" ? "default" : "ghost"} 
                            size="sm"
                            onClick={() => setActiveEstimationModule("overview")}
                          >
                            Executive Overview
                          </Button>
                          <Button 
                            variant={activeEstimationModule === "generator" ? "default" : "ghost"} 
                            size="sm"
                            onClick={() => setActiveEstimationModule("generator")}
                          >
                            Estimate Generator
                          </Button>
                          <Button 
                            variant={activeEstimationModule === "compare" ? "default" : "ghost"} 
                            size="sm"
                            onClick={() => setActiveEstimationModule("compare")}
                          >
                            Compare Budgets
                          </Button>
                          <Button 
                            variant={activeEstimationModule === "basis" ? "default" : "ghost"} 
                            size="sm"
                            onClick={() => setActiveEstimationModule("basis")}
                          >
                            Basis of Estimate
                          </Button>
                        </div>
                      </div>

                      {/* Conditionally render based on active module */}
                      {activeEstimationModule === "generator" ? (
                        <EstimateGenerator selectedDesignOption={selectedDesignOption} />
                      ) : activeEstimationModule === "compare" ? (
                        <CompareBudgets />
                      ) : activeEstimationModule === "basis" ? (
                        <BasisOfEstimate />
                      ) : (
                        <>
                      {/* Main Content - with scroll */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Filters and Stats Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Scenario:</span>
                              <select className="px-3 py-1 border rounded-md text-sm bg-background">
                                <option>Baseline</option>
                                <option>Option A</option>
                                <option>Option B</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Version:</span>
                              <select className="px-3 py-1 border rounded-md text-sm bg-background">
                                <option>DD-S04</option>
                                <option>SD-S02</option>
                                <option>CD-S01</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>📍 Metro</span>
                              <span className="text-muted-foreground">AACE Class 4</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <div className="text-3xl font-bold">$12,500,000</div>
                              <div className="text-sm text-muted-foreground">Total</div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold">$425/SF</div>
                              <div className="text-sm text-muted-foreground">Per SF</div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold">🟡 78%</div>
                              <div className="text-sm text-muted-foreground">Confidence</div>
                            </div>
                          </div>
                        </div>

                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-4 gap-4">
                          {/* Estimate Value Card */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                💵 Estimate Value
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold">$12,500,000 (425/SF)</div>
                                <div className="text-sm text-green-600 flex items-center gap-1">
                                  <span>↑ 8.2% since DD-S02</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Change mainly from Scope Adds and Market conditions; Hard/Soft 75% / 25%.
                                </p>
                                <a href="#" className="text-xs text-primary">Scope Adds drove 45% of change. Open Waterfall →</a>
                                <p className="text-xs text-muted-foreground mt-2">Source: Cost Database • Baseline • DD-S04</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Estimate Confidence Card */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                🎯 Estimate Confidence
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold">78%</div>
                                <div className="relative h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                                  <div className="absolute top-0 left-[78%] w-3 h-3 bg-foreground rounded-full -mt-0.5"></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Low Risk</span>
                                  <span>High Risk</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Design completion: 68% • Contingency: 12% (below 15% DD target)
                                </p>
                                <a href="#" className="text-xs text-primary">
                                  Electrical/HVAC systems need design completion – they're 30% of budget but only 60% finished. View Risk Map →
                                </a>
                                <p className="text-xs text-muted-foreground mt-2">Source: Cost Database • Baseline • DD-S04</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Market Fit Card */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                🟢 Market Fit
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold text-green-600">+7.6% vs Metro median</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Driven by premium finishes and jurisdictional requirements; largely regional.
                                </p>
                                <a href="#" className="text-xs text-primary">
                                  Electrical/HVAC costs are 15% higher than similar projects. View Comparison →
                                </a>
                                <p className="text-xs text-muted-foreground mt-2">Source: Cost Database • Baseline • DD-S04</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Next Steps Card */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                🔴 Next Steps
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold">5 design areas need completion</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Structural Steel drawings • Electrical/HVAC specifications • Interior finishes • Curtainwall details • MEP coordination
                                </p>
                                <a href="#" className="text-xs text-primary">
                                  Complete structural drawings and finalize Electrical/HVAC specifications to improve design confidence. View Details →
                                </a>
                                <p className="text-xs text-muted-foreground mt-2">Source: Cost Database • Baseline • DD-S04</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Stories Accordions */}
                        <Accordion type="single" collapsible className="space-y-4">
                          {/* Story of Estimate Value */}
                          <Card>
                            <AccordionItem value="estimate-value" className="border-0">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <BarChart3 className="h-5 w-5 text-blue-600" />
                                  <span className="text-lg font-semibold">Story of Estimate Value</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <CardContent className="pt-4">
                                  <p className="text-sm text-muted-foreground mb-6">
                                    Current budget status, changes since last phase, and how much is finalized vs still estimated
                                  </p>

                                  {/* Cost Evolution by Phase */}
                                  <div className="mb-6">
                                    <h3 className="text-sm font-semibold mb-4">Cost Evolution by Phase</h3>
                                    <ResponsiveContainer width="100%" height={280}>
                                      <BarChart data={[
                                        { phase: 'SD', hard: 60, soft: 30, perSF: 300 },
                                        { phase: 'DD', hard: 75, soft: 30, perSF: 350 },
                                        { phase: 'CD', hard: 75, soft: 30, perSF: 350 }
                                      ]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="phase" />
                                        <YAxis yAxisId="left" label={{ value: '$120M', position: 'top' }} domain={[0, 120]} />
                                        <YAxis yAxisId="right" orientation="right" label={{ value: '$600/SF', position: 'top' }} domain={[0, 600]} />
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Bar yAxisId="left" dataKey="hard" stackId="cost" fill="#3b82f6" name="Hard Cost" />
                                        <Bar yAxisId="left" dataKey="soft" stackId="cost" fill="#10b981" name="Soft Cost" />
                                        <Line yAxisId="right" type="monotone" dataKey="perSF" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="$/SF" />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>

                                  {/* Phase Details */}
                                  <div className="space-y-4 mb-6">
                                    <div className="flex items-start justify-between border-b pb-3">
                                      <div className="flex-1">
                                        <div className="font-semibold mb-1">SD</div>
                                        <p className="text-sm text-muted-foreground">
                                          Jump from Concept → SD driven by code-required egress core and added generator redundancy.
                                        </p>
                                      </div>
                                      <div className="text-right ml-8">
                                        <div className="text-xl font-bold">$98.4M</div>
                                        <div className="text-xs text-muted-foreground">Hard: $74.1M | Soft: $24.3M</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start justify-between border-b pb-3">
                                      <div className="flex-1">
                                        <div className="font-semibold mb-1">DD</div>
                                        <p className="text-sm text-muted-foreground">
                                          Increase is mostly clarified quantities, not scope creep. Envelope spec locked.
                                        </p>
                                      </div>
                                      <div className="text-right ml-8">
                                        <div className="text-xl font-bold">$101.2M</div>
                                        <div className="text-xs text-muted-foreground">Hard: $76.0M | Soft: $25.2M</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start justify-between pb-3">
                                      <div className="flex-1">
                                        <div className="font-semibold mb-1">CD</div>
                                        <p className="text-sm text-muted-foreground">
                                          Delta vs DD is &lt;1.5%. Now behaving like a controllable GMP candidate.
                                        </p>
                                      </div>
                                      <div className="text-right ml-8">
                                        <div className="text-xl font-bold">$102.6M</div>
                                        <div className="text-xs text-muted-foreground">Hard: $76.9M | Soft: $25.7M</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Two Column Layout */}
                                  <div className="grid grid-cols-2 gap-6">
                                    {/* Left: Waterfall Chart */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">This Phase Change (Waterfall)</h3>
                                      <ResponsiveContainer width="100%" height={280}>
                                        <BarChart 
                                          data={[
                                            { category: 'Scope Adds\n(Owner)', value: 0.72, fill: '#10b981' },
                                            { category: 'Code / Compliance', value: 0.58, fill: '#10b981' },
                                            { category: 'Clarified\nQuantities', value: 0.48, fill: '#10b981' },
                                            { category: 'Market Escalation', value: 0.35, fill: '#10b981' },
                                            { category: 'Value\nEngineering', value: -0.73, fill: '#ef4444' }
                                          ]}
                                          layout="vertical"
                                          margin={{ left: 80, right: 20 }}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis type="number" domain={[-1.2, 1.2]} tickFormatter={(value) => `$${value}M`} />
                                          <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 11 }} />
                                          <Tooltip formatter={(value) => `$${value}M`} />
                                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                            {[
                                              { category: 'Scope Adds\n(Owner)', value: 0.72, fill: '#10b981' },
                                              { category: 'Code / Compliance', value: 0.58, fill: '#10b981' },
                                              { category: 'Clarified\nQuantities', value: 0.48, fill: '#10b981' },
                                              { category: 'Market Escalation', value: 0.35, fill: '#10b981' },
                                              { category: 'Value\nEngineering', value: -0.73, fill: '#ef4444' }
                                            ].map((entry, index) => (
                                              <rect key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                          </Bar>
                                        </BarChart>
                                      </ResponsiveContainer>
                                    </div>

                                    {/* Right: Budget Breakdown Donut Charts */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">Budget Breakdown by Phase</h3>
                                      <div className="grid grid-cols-3 gap-4">
                                        {[
                                          { phase: 'SD', defined: 55, allowance: 28, contingency: 17 },
                                          { phase: 'DD', defined: 67, allowance: 22, contingency: 11 },
                                          { phase: 'CD', defined: 78, allowance: 14, contingency: 8 }
                                        ].map((data) => (
                                          <div key={data.phase} className="text-center">
                                            <div className="font-medium mb-2">{data.phase}</div>
                                            <ResponsiveContainer width="100%" height={120}>
                                              <PieChart>
                                                <Pie
                                                  data={[
                                                    { name: 'Defined', value: data.defined, fill: '#10b981' },
                                                    { name: 'Allowance', value: data.allowance, fill: '#3b82f6' },
                                                    { name: 'Contingency', value: data.contingency, fill: '#f59e0b' }
                                                  ]}
                                                  cx="50%"
                                                  cy="50%"
                                                  innerRadius={25}
                                                  outerRadius={45}
                                                  dataKey="value"
                                                />
                                              </PieChart>
                                            </ResponsiveContainer>
                                            <div className="text-xs text-muted-foreground">
                                              {data.defined}% / {data.allowance}% / {data.contingency}%
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      {/* Legend */}
                                      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                                        <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                          <span>Defined</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                          <span>Allowance</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                          <span>Contingency</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* AI Summary and Status */}
                                  <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t">
                                    <div>
                                      <h3 className="text-sm font-semibold mb-2">AI Summary</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Cost increased 1.4% since DD phase. Main causes: electrical quantity updates and code-required stair modifications. 
                                        This is normal project progression, not uncontrolled scope changes.
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Construction Documents are 78% finalized. Typical completion at this stage is 75-80%. We're on track, but Interior 
                                        finishes and IT equipment still need final specifications.
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </AccordionContent>
                            </AccordionItem>
                          </Card>

                          {/* Story of Confidence */}
                          <Card>
                            <AccordionItem value="confidence" className="border-0">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <Target className="h-5 w-5 text-amber-600" />
                                  <span className="text-lg font-semibold">Story of Confidence</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <CardContent className="pt-4">
                                  <p className="text-sm text-muted-foreground mb-6">
                                    How reliable is the estimate, where could it still swing, and what scares us the most
                                  </p>

                                  {/* Top Row: System Risk Analysis & Contingency Buffer */}
                                  <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Left: System Risk Analysis */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">System Risk Analysis</h3>
                                      <ResponsiveContainer width="100%" height={280}>
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis 
                                            type="number" 
                                            dataKey="completion" 
                                            name="Design Completion %" 
                                            domain={[0, 100]}
                                            label={{ value: 'Design Completion %', position: 'bottom', offset: 20 }}
                                            tickFormatter={(value) => `${value}%`}
                                          />
                                          <YAxis 
                                            type="number" 
                                            dataKey="costPercent" 
                                            name="% of Total Project Cost"
                                            domain={[0, 25]}
                                            label={{ value: '% of Total Project Cost', angle: -90, position: 'left', offset: 40 }}
                                            tickFormatter={(value) => `${value}%`}
                                          />
                                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                          <Scatter 
                                            name="Systems" 
                                            data={[
                                              { system: 'Electrical', completion: 40, costPercent: 18, risk: 'High', fill: '#ef4444' },
                                              { system: 'HVAC', completion: 50, costPercent: 14, risk: 'Medium', fill: '#f59e0b' },
                                              { system: 'Interiors', completion: 65, costPercent: 12, risk: 'Medium', fill: '#f59e0b' },
                                              { system: 'Curtainwall', completion: 60, costPercent: 10, risk: 'Low', fill: '#14b8a6' },
                                              { system: 'Site', completion: 75, costPercent: 7, risk: 'Low', fill: '#14b8a6' }
                                            ]}
                                          >
                                            {[
                                              { system: 'Electrical', completion: 40, costPercent: 18, risk: 'High', fill: '#ef4444' },
                                              { system: 'HVAC', completion: 50, costPercent: 14, risk: 'Medium', fill: '#f59e0b' },
                                              { system: 'Interiors', completion: 65, costPercent: 12, risk: 'Medium', fill: '#f59e0b' },
                                              { system: 'Curtainwall', completion: 60, costPercent: 10, risk: 'Low', fill: '#14b8a6' },
                                              { system: 'Site', completion: 75, costPercent: 7, risk: 'Low', fill: '#14b8a6' }
                                            ].map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                          </Scatter>
                                        </ScatterChart>
                                      </ResponsiveContainer>
                                      
                                      {/* Legend */}
                                      <div className="mt-4">
                                        <div className="text-xs font-semibold mb-2">System Risk Legend</div>
                                        <div className="flex flex-wrap gap-4 text-xs">
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <span>Electrical</span>
                                            <span className="text-muted-foreground">(High)</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            <span>Curtainwall</span>
                                            <span className="text-muted-foreground">(Low)</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            <span>HVAC</span>
                                            <span className="text-muted-foreground">(Medium)</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            <span>Interiors</span>
                                            <span className="text-muted-foreground">(Medium)</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            <span>Site</span>
                                            <span className="text-muted-foreground">(Low)</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Critical Risk Callout */}
                                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <div className="flex items-start gap-2">
                                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                          <div className="flex-1">
                                            <div className="text-sm font-semibold mb-1">Critical Risk</div>
                                            <p className="text-xs text-muted-foreground">
                                              Electrical systems represent 18% of total cost but are only 40% designed. This creates the highest cost uncertainty. 
                                              Need to complete electrical drawings and equipment specifications.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Contingency Buffer Tracking */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">Contingency Buffer Tracking</h3>
                                      <ResponsiveContainer width="100%" height={280}>
                                        <LineChart 
                                          data={[
                                            { phase: 'SD', contingency: 12.5 },
                                            { phase: 'DD', contingency: 9.2 },
                                            { phase: 'CD', contingency: 7.8 }
                                          ]}
                                          margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="phase" />
                                          <YAxis 
                                            domain={[0, 16]} 
                                            tickFormatter={(value) => `${value}%`}
                                            ticks={[0, 4, 8, 12, 16]}
                                          />
                                          <Tooltip formatter={(value) => `${value}%`} />
                                          <Line 
                                            type="monotone" 
                                            dataKey="contingency" 
                                            stroke="#ef4444" 
                                            strokeWidth={2}
                                            dot={{ fill: '#ef4444', r: 6, strokeWidth: 2, stroke: '#fff' }}
                                            name="Contingency %"
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>

                                      {/* Contingency Details */}
                                      <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">SD</span>
                                          <span className="font-bold">12.5%</span>
                                          <span className="text-muted-foreground text-xs">Normal SD range is 10-15%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">DD</span>
                                          <span className="font-bold">9.2%</span>
                                          <span className="text-muted-foreground text-xs">Normal DD range is 7-10%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">CD</span>
                                          <span className="font-bold">7.8%</span>
                                          <span className="text-muted-foreground text-xs">Normal CD range is 5-7% (we're high due to Interiors not frozen)</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bottom Row: Cost Impact Analysis & Decisions Look Ahead */}
                                  <div className="grid grid-cols-2 gap-6">
                                    {/* Left: Cost Impact Analysis */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">Cost Impact Analysis</h3>
                                      <ResponsiveContainer width="100%" height={240}>
                                        <BarChart 
                                          data={[
                                            { category: 'UPS Redundancy (N vs N+1)', value: 4.8 },
                                            { category: 'ISOT Cleanroom in Phase', value: 3.2 },
                                            { category: 'Curtainwall Custom Profile', value: 2.8 },
                                            { category: 'Steel Rate Escalation', value: 1.8 },
                                            { category: 'Import Duty on Switchgear', value: 1.2 }
                                          ]}
                                          layout="vertical"
                                          margin={{ left: 150, right: 20 }}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis type="number" tickFormatter={(value) => `$${value}M`} />
                                          <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 10 }} />
                                          <Tooltip formatter={(value) => `$${value}M`} />
                                          <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                      </ResponsiveContainer>

                                      {/* Chart Summary */}
                                      <div className="mt-4 text-xs text-muted-foreground">
                                        <span className="font-semibold">Chart Summary:</span> This analysis shows 5 key factors that could impact project costs by a total of ±$12.2M. 
                                        The top 3 factors (UPS redundancy, cleanroom specs, curtainwall) account for 79% of total cost sensitivity. Market factors like 
                                        steel rates and import duties represent smaller but still significant impacts.
                                      </div>
                                    </div>

                                    {/* Right: Decisions Look Ahead */}
                                    <div>
                                      <h3 className="text-sm font-semibold mb-4">Decisions Look Ahead</h3>
                                      <div className="space-y-3">
                                        {[
                                          { 
                                            title: 'Structural Steel Quantities',
                                            description: 'Finalize structural drawings to lock steel quantities',
                                            completion: '85% complete',
                                            budget: '12% of budget',
                                            status: 'Uncertain',
                                            color: 'text-amber-600'
                                          },
                                          { 
                                            title: 'Electrical/HVAC Specifications',
                                            description: 'Complete electrical drawings and equipment specifications',
                                            completion: '40% complete',
                                            budget: '18% of budget',
                                            status: 'Risky',
                                            color: 'text-red-600'
                                          },
                                          { 
                                            title: 'Interior Finishes Specifications',
                                            description: 'Standardize interior specifications to improve budget accuracy',
                                            completion: '45% complete',
                                            budget: '8% of budget',
                                            status: 'Risky',
                                            color: 'text-red-600'
                                          },
                                          { 
                                            title: 'Curtainwall Details',
                                            description: 'Finalize curtainwall profiles to confirm fabrication costs',
                                            completion: '65% complete',
                                            budget: '12% of budget',
                                            status: 'Uncertain',
                                            color: 'text-amber-600'
                                          },
                                          { 
                                            title: 'MEP Systems Coordination',
                                            description: 'Complete MEP coordination drawings for installation clarity',
                                            completion: '60% complete',
                                            budget: '30% of budget',
                                            status: 'Uncertain',
                                            color: 'text-amber-600'
                                          }
                                        ].map((item, idx) => (
                                          <div key={idx} className="border-b pb-3 last:border-0">
                                            <div className="font-medium text-sm mb-1">{item.title}</div>
                                            <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                            <div className="flex items-center gap-3 text-xs">
                                              <span className="text-muted-foreground">{item.completion}</span>
                                              <span className="text-muted-foreground">•</span>
                                              <span className="text-muted-foreground">{item.budget}</span>
                                              <span className="text-muted-foreground">•</span>
                                              <span className={item.color}>{item.status}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </AccordionContent>
                            </AccordionItem>
                          </Card>

                          {/* Story of Market Fit */}
                          <Card>
                            <AccordionItem value="market-fit" className="border-0">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                  <span className="text-lg font-semibold">Story of Market Fit</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <CardContent className="pt-4">
                                  <p className="text-sm text-muted-foreground mb-6">
                                    How does our estimate compare to market benchmarks and peer projects
                                  </p>

                                  <div className="grid grid-cols-2 gap-8">
                                    {/* Left: Market Comparison */}
                                    <Card className="border">
                                      <CardHeader>
                                        <CardTitle className="text-base">Market Comparison</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between py-2">
                                          <span className="text-sm font-medium">Our $/SF</span>
                                          <span className="text-lg font-bold text-green-600">$425/SF</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-t">
                                          <span className="text-sm font-medium">Metro Median</span>
                                          <span className="text-lg font-bold">$395/SF</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-t">
                                          <span className="text-sm font-medium">Variance</span>
                                          <span className="text-lg font-bold text-orange-600">+7.6%</span>
                                        </div>
                                        <div className="pt-4 border-t">
                                          <p className="text-xs text-muted-foreground">
                                            Driven by premium finishes and jurisdictional requirements; largely regional variance.
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Right: Benchmark Sources */}
                                    <Card className="border">
                                      <CardHeader>
                                        <CardTitle className="text-base">Benchmark Sources</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between py-2">
                                          <span className="text-sm font-medium">RSMeans</span>
                                          <span className="text-xs text-muted-foreground">As of Jan 15, 2024</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-t">
                                          <span className="text-sm font-medium">Marshall & Swift</span>
                                          <span className="text-xs text-muted-foreground">As of Jan 30, 2024</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-t">
                                          <span className="text-sm font-medium">Local GCs</span>
                                          <span className="text-xs text-muted-foreground">As of Feb 14, 2024</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CardContent>
                              </AccordionContent>
                            </AccordionItem>
                          </Card>

                          {/* Story of Next Steps */}
                          <Card>
                            <AccordionItem value="next-steps" className="border-0">
                              <AccordionTrigger className="px-6 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                  <span className="text-lg font-semibold">Story of Next Steps</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <CardContent className="pt-4">
                                  <p className="text-sm text-muted-foreground mb-6">
                                    Design completion status and recommended actions to improve reliability
                                  </p>

                                  {/* Design Completion Status */}
                                  <div className="mb-8">
                                    <h3 className="text-base font-semibold mb-4">Design Completion Status</h3>
                                    <div className="space-y-4">
                                      {/* Structural Steel */}
                                      <div className="flex items-start justify-between py-3 border-b">
                                        <div className="flex-1">
                                          <div className="font-medium mb-1">Structural Steel</div>
                                          <p className="text-sm text-muted-foreground">Design Development complete</p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xl font-bold text-green-600">85%</div>
                                          <div className="text-sm text-green-600">Ready</div>
                                        </div>
                                      </div>

                                      {/* Electrical/HVAC Systems */}
                                      <div className="flex items-start justify-between py-3 border-b">
                                        <div className="flex-1">
                                          <div className="font-medium mb-1">Electrical/HVAC Systems</div>
                                          <p className="text-sm text-muted-foreground">Schematic Design phase</p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xl font-bold text-red-600">40%</div>
                                          <div className="text-sm text-red-600">Critical</div>
                                        </div>
                                      </div>

                                      {/* Interior Finishes */}
                                      <div className="flex items-start justify-between py-3">
                                        <div className="flex-1">
                                          <div className="font-medium mb-1">Interior Finishes</div>
                                          <p className="text-sm text-muted-foreground">Concept Design phase</p>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xl font-bold text-orange-600">45%</div>
                                          <div className="text-sm text-orange-600">Pending</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Recommended Actions */}
                                  <div>
                                    <h3 className="text-base font-semibold mb-4">Recommended Actions</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <div className="font-medium mb-1">1. Finalize Structural Steel Drawings</div>
                                        <p className="text-sm text-muted-foreground">
                                          Complete structural drawings to lock steel quantities and improve cost accuracy.
                                        </p>
                                      </div>

                                      <div>
                                        <div className="font-medium mb-1">2. Complete Electrical/HVAC Specifications</div>
                                        <p className="text-sm text-muted-foreground">
                                          Finalize equipment specifications and drawings to improve design confidence.
                                        </p>
                                      </div>

                                      <div>
                                        <div className="font-medium mb-1">3. Standardize Interior Specifications</div>
                                        <p className="text-sm text-muted-foreground">
                                          Define finish standards to improve budget accuracy.
                                        </p>
                                      </div>

                                      <div>
                                        <div className="font-medium mb-1">4. Finalize Curtainwall Profiles</div>
                                        <p className="text-sm text-muted-foreground">
                                          Complete curtainwall details to confirm fabrication costs.
                                        </p>
                                      </div>

                                      <div>
                                        <div className="font-medium mb-1">5. Complete MEP Coordination</div>
                                        <p className="text-sm text-muted-foreground">
                                          Finalize coordination drawings for installation cost clarity.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </AccordionContent>
                            </AccordionItem>
                          </Card>
                        </Accordion>
                      </div>
                      </>
                      )}
                    </>
                  )}
                </div>

                {/* Right Sidebar - Design Options */}
                <div className={`${isDesignSidebarCollapsed ? 'w-14' : 'w-96'} bg-card border-l overflow-y-auto transition-all duration-300`}>
                  {isDesignSidebarCollapsed ? (
                    <div className="p-3">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsDesignSidebarCollapsed(false)}
                        className="w-full"
                      >
                        <PanelRightOpen className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">Design Options</h2>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setIsDesignSidebarCollapsed(true)}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="p-4 space-y-3">
                        {!designOptionsGenerated ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Upload a design and generate options to see them here.
                          </p>
                        ) : (
                      [
                        { 
                          id: 1, 
                          title: "Option 1",
                          view: "2D",
                          codeCompliant: true,
                          cost: "$33.8M",
                          schedule: "13 mo",
                          gfa: "120k sf",
                          sustainability: "92%"
                        },
                        { 
                          id: 2, 
                          title: "Option 2",
                          view: "2D",
                          codeCompliant: true,
                          cost: "$35.2M",
                          schedule: "14 mo",
                          gfa: "125k sf",
                          sustainability: "88%"
                        },
                        { 
                          id: 3, 
                          title: "Option 3",
                          view: "2D",
                          codeCompliant: false,
                          cost: "$31.5M",
                          schedule: "12 mo",
                          gfa: "115k sf",
                          sustainability: "95%"
                        }
                      ].map((option, index) => (
                        <Collapsible 
                          key={option.id}
                          open={expandedDesignOption === option.id}
                          onOpenChange={() => setExpandedDesignOption(expandedDesignOption === option.id ? null : option.id)}
                        >
                          <Card className="overflow-hidden">
                            <CollapsibleTrigger className="w-full">
                              <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {option.title}
                                </h3>
                                {expandedDesignOption === option.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="px-4 pb-4 space-y-4">
                                {/* View Selector */}
                                <div>
                                  <p className="text-sm font-medium mb-2">View:</p>
                                  <div className="flex gap-2">
                                    {["2D", "3D", "Render"].map((view) => (
                                      <button
                                        key={view}
                                        onClick={() => setSelectedView(prev => ({ ...prev, [option.id]: view }))}
                                        className={`px-3 py-1.5 text-sm rounded ${
                                          (selectedView[option.id] || option.view) === view
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-foreground hover:bg-muted/80"
                                        }`}
                                      >
                                        {(selectedView[option.id] || option.view) === view && "✓ "}
                                        {view}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Design Preview */}
                                <div className="bg-muted rounded border p-4 h-32 flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    {selectedView[option.id] || option.view} View Preview
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                  {option.codeCompliant && (
                                    <div className="flex items-center gap-2 text-construction-success">
                                      <CheckCircle2 className="h-4 w-4" />
                                      <span className="text-sm font-medium">100% Code Compliant</span>
                                    </div>
                                  )}
                                  <p className="text-sm"><strong>Cost:</strong> {option.cost}</p>
                                  <p className="text-sm"><strong>Schedule:</strong> {option.schedule}</p>
                                  <p className="text-sm"><strong>GFA:</strong> {option.gfa}</p>
                                  <p className="text-sm"><strong>Sustainability:</strong> {option.sustainability}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedDesignOption(option.id)}
                                  >
                                    Select
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedDesignOption(option.id)}
                                  >
                                    View / Modify
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="flex-1 bg-construction-success hover:bg-construction-success/90"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      ))
                    )}
                  </div>
                    </>
                  )}
                </div>
              </div>
              )}

              {/* T2 Content - 5D Schedule */}
              {active5DView === "t2" && (
                <FiveDSchedule />
              )}
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
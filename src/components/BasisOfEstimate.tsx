import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database, FileText, AlertTriangle, Receipt, ArrowRight, Download } from "lucide-react";
import { SourcesIndicesDetail } from "./SourcesIndicesDetail";
import { AssumptionsAllowancesDetail } from "./AssumptionsAllowancesDetail";
import { RiskRegisterDetail } from "./RiskRegisterDetail";
import { CommercialMarkupsDetail } from "./CommercialMarkupsDetail";

type DetailView = "main" | "sources" | "assumptions" | "risks" | "commercial";

export function BasisOfEstimate() {
  const [detailView, setDetailView] = useState<DetailView>("main");

  if (detailView === "sources") {
    return <SourcesIndicesDetail onBack={() => setDetailView("main")} />;
  }

  if (detailView === "assumptions") {
    return <AssumptionsAllowancesDetail onBack={() => setDetailView("main")} />;
  }

  if (detailView === "risks") {
    return <RiskRegisterDetail onBack={() => setDetailView("main")} />;
  }

  if (detailView === "commercial") {
    return <CommercialMarkupsDetail onBack={() => setDetailView("main")} />;
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Selected Estimate</h2>
            <Select defaultValue="estimate-1">
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estimate-1">Select Estimate...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-8 text-sm">
          <div>
            <span className="text-muted-foreground">Scenario: </span>
            <Select defaultValue="baseline">
              <SelectTrigger className="inline-flex w-auto h-auto p-0 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-muted-foreground">AACE Class: </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Class 3 Estimate
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Region Factor: </span>
            <span className="font-medium">NYC Metro x1.12</span>
          </div>
          <div>
            <span className="text-muted-foreground">Confidence: </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              82%
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Sources & Indices */}
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              onClick={() => setDetailView("sources")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Sources & Indices</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Data sources, freshness, and regional factors
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Sources</span>
                      <span className="font-semibold">20</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Industry Standard</span>
                      <Badge variant="secondary" className="text-xs">CSI Divisions</Badge>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-4 text-primary">
                    View Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Assumptions */}
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              onClick={() => setDetailView("assumptions")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Assumptions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Qualitative inputs driving estimate
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Assumptions</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Low Confidence</span>
                      <span className="font-semibold text-red-600">1</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-4 text-primary">
                    View Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Risks & Contingency */}
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              onClick={() => setDetailView("risks")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Risks & Contingency</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Risk register and contingency distribution
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Identified Risks</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Exposure</span>
                      <span className="font-semibold text-red-600">$5.2M</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-4 text-primary">
                    View Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Commercial Markups */}
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              onClick={() => setDetailView("commercial")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <Receipt className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Commercial Markups</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    OH&P, tax, bond, escalation policies
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Markups</span>
                      <span className="font-semibold">28.25%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Model</span>
                      <span className="font-semibold">CMAR</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 h-auto mt-4 text-primary">
                    View Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Confidence Summary */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-4">Confidence Summary</h3>
            <div className="grid grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">82%</div>
                <div className="text-sm text-muted-foreground mt-1">Confidence</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">68%</div>
                <div className="text-sm text-muted-foreground mt-1">% Defined</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">32%</div>
                <div className="text-sm text-muted-foreground mt-1">Allowances</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">124d</div>
                <div className="text-sm text-muted-foreground mt-1">Avg Source Age</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">8</div>
                <div className="text-sm text-muted-foreground mt-1">Open Assumptions</div>
              </div>
            </div>
          </Card>

          {/* AI Copilot Section */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">AI Copilot</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Context-aware assistance for BoE management
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Quick Actions</span>
                    <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground space-y-1">
                      <li>"Refresh all stale indices"</li>
                      <li>"Explain confidence drop"</li>
                      <li>"List high-impact risks"</li>
                    </ul>
                  </div>
                  <div className="text-sm pt-2 border-t">
                    <span className="font-medium">Analysis</span>
                    <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground space-y-1">
                      <li>"Why is Mechanical amber?"</li>
                      <li>"Convert IT allowance to firm"</li>
                      <li>"Apply P80 contingency"</li>
                    </ul>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Ask AI
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

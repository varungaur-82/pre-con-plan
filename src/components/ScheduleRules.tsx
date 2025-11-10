import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Calendar, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Trade Calendar Dropdown Component
const TradeCalendarDropdown = ({ tradeName }: { tradeName: string }) => {
  const [selectedCalendar, setSelectedCalendar] = useState("Project (default)");
  
  const calendarOptions = [
    "Project (default)",
    "6×10 • No Sundays",
    "5×8 • Mon–Fri"
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-24">{tradeName}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex-1 justify-between text-sm font-normal"
          >
            {selectedCalendar}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-popover z-50" align="start">
          {calendarOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => setSelectedCalendar(option)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {selectedCalendar === option && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" className="text-destructive">
        Remove
      </Button>
    </div>
  );
};

export function ScheduleRules() {
  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-auto">
      <div className="container px-6 py-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Calendars: 06/11/2025</span>
            <span>Labor Set: 06/11/2025</span>
            <span>Weather Pack (NYC): 06/11/2025</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Refresh NYC Weather
            </Button>
            <Badge variant="secondary">BoS v1.0</Badge>
            <Button variant="outline" size="sm">Initial baseline</Button>
            <Button variant="outline" size="sm">Save as Version</Button>
            <Button size="sm">
              Apply (Delta Preview)
            </Button>
          </div>
        </div>

        {/* Calendars Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Calendars</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              AI: Generate 6×10 + NYC holidays
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Define working days/hours, holidays, and trade-specific overrides the engine uses to roll durations and critical path. Weather de-rates adjust productivity, not geometry.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Project Calendar */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Project Calendar</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Project-wide base schedule: work pattern, hours per day, holidays and blackouts.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <input 
                        type="text" 
                        value="Project • 6×10 (No Sundays)" 
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Working Days</label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Mon
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Tue
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Wed
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Thu
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Fri
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox checked /> Sat
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <Checkbox /> Sun
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Daily Hours</label>
                      <select className="w-20 px-3 py-2 border rounded-md text-sm">
                        <option>10</option>
                        <option>8</option>
                        <option>12</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Holidays</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">2026-01-01 ×</Badge>
                        <Badge variant="secondary">2026-07-04 ×</Badge>
                        <Badge variant="secondary">2026-11-26 ×</Badge>
                        <Badge variant="secondary">2026-12-25 ×</Badge>
                      </div>
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Blackouts</label>
                      <input 
                        type="date" 
                        placeholder="dd/mm/yyyy"
                        className="w-full px-3 py-2 border rounded-md text-sm mb-2"
                      />
                      <input 
                        type="date" 
                        placeholder="dd/mm/yyyy"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Metro</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>NYC</option>
                        <option>LA</option>
                        <option>Chicago</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">Switch to 5×8</Button>
                      <Button variant="outline" size="sm">Apply Envelope de-rate</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Calendars (Overrides) */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Trade Calendars (Overrides)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optional trade/package calendars that override the project calendar when different working time is required.
                  </p>

                  <div className="space-y-3">
                    <TradeCalendarDropdown tradeName="Envelope" />
                    <TradeCalendarDropdown tradeName="Roofing" />

                    <Button variant="outline" size="sm" className="w-full">
                      Add Trade
                    </Button>

                    <div className="mt-4 p-3 bg-background border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Laddering: Activity &gt; Trade &gt; Project
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labor Set & Productivity Bands Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Labor Set & Productivity Bands</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">AI: Switch labor set</Button>
              <Button variant="outline" size="sm">+10% Drywall rate</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Choose labor basis and set safe productivity envelopes used to compute durations from quantities. Changes are guardrailed and always staged before apply.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* Labor Set */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Labor Set</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the labor market baseline (e.g., Union NYC). Metro and effective date drive downstream rates.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>Union NYC 2026</option>
                        <option>Non-Union NYC 2026</option>
                        <option>Union LA 2026</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Metro</label>
                      <input 
                        type="text" 
                        value="NYC" 
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Effective</label>
                      <input 
                        type="date" 
                        value="2026-01-01" 
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bands */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Bands</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Per-trade basis/min/max production rates. The engine keeps edits inside bands; outside-band requests require approval.
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-5 text-sm font-medium">Drywall (sf/crew-day)</span>
                      <input type="number" value="2" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <input type="number" value="1.6" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <input type="number" value="2.4" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <Button variant="ghost" size="sm" className="col-span-1 text-destructive p-0">Remove</Button>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-5 text-sm font-medium">Curtainwall (panels/cre</span>
                      <input type="number" value="12" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <input type="number" value="9" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <input type="number" value="14" className="col-span-2 px-2 py-1 border rounded text-sm text-center" />
                      <Button variant="ghost" size="sm" className="col-span-1 text-destructive p-0">Remove</Button>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Add Band
                    </Button>

                    <div className="mt-4 p-3 bg-background border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Inside-band only. Out-of-band requires approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Rules */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Shift Rules</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable second shift/weekends and set premiums. Impacts effective productivity, not scope.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox checked />
                      <span className="text-sm">Second shift</span>
                    </label>
                    <span className="text-sm">Night premium</span>
                    <input type="number" value="1.15" step="0.01" className="w-20 px-2 py-1 border rounded text-sm" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox checked />
                      <span className="text-sm">Weekends</span>
                    </label>
                    <span className="text-sm">Weekend premium</span>
                    <input type="number" value="1.2" step="0.01" className="w-20 px-2 py-1 border rounded text-sm" />
                  </div>
                </div>
              </div>

              {/* Stacking Limits */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Stacking Limits</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control how many concurrent crews operate per level/zone and vertical simultaneity to reduce overcrowding and risk.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm flex-1">Finishes crews/level (max)</span>
                    <input type="number" value="2" className="w-16 px-2 py-1 border rounded text-sm text-center" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm flex-1">Wet Trades vertical floors</span>
                    <input type="number" value="2" className="w-16 px-2 py-1 border rounded text-sm text-center" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm flex-1">Exceptions policy</span>
                    <select className="flex-1 px-2 py-1 border rounded text-sm">
                      <option>Require Approval</option>
                      <option>Allow</option>
                      <option>Block</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm w-24">Finishes</span>
                    <input type="number" value="2" className="w-16 px-2 py-1 border rounded text-sm text-center" />
                    <Button variant="ghost" size="sm" className="ml-auto text-destructive">Remove</Button>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Add Trade
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buffer / Contingency & Construction Class Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buffer / Contingency & Construction Class</CardTitle>
            <p className="text-sm text-muted-foreground">
              Define small schedule buffers within allowed bands and assign Construction Class (Soft/Hard) by default and by trade to control movement tolerance.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Buffer / Contingency */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Buffer / Contingency</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add limited contingency days overall or by trade, always staged and applied via Delta Preview.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Buffer days (0–3)</span>
                      <input 
                        type="number" 
                        value="0" 
                        min="0"
                        max="3"
                        className="w-20 px-3 py-2 border rounded-md text-sm text-center"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Adds safety time inside BoS bands; applied via Delta Preview.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Envelope</span>
                        <input 
                          type="number" 
                          value="1" 
                          className="w-20 px-2 py-1 border rounded text-sm text-center"
                        />
                        <Button variant="ghost" size="sm" className="ml-auto text-destructive">
                          Remove
                        </Button>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        Add Trade Buffer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Construction Class */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Construction Class</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Soft allows safe adjustments within bands; Hard fixes dates for select nodes or trades.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Default Class</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>Soft</option>
                        <option>Hard</option>
                      </select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Soft can slip within bands; Hard is fixed-date policy for select nodes.
                      </p>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium mb-2 block">Trade Assignments</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm w-32">Envelope</span>
                          <select className="flex-1 px-2 py-1 border rounded text-sm">
                            <option>Hard</option>
                            <option>Soft</option>
                          </select>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remove
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm w-32">Foundations</span>
                          <select className="flex-1 px-2 py-1 border rounded text-sm">
                            <option>Hard</option>
                            <option>Soft</option>
                          </select>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remove
                          </Button>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          Add Trade
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Freshness & Health Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Freshness & Health</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track staleness and quickly refresh inputs (calendars, labor, weather). See last updated dates and apply via Delta Preview.
              </p>
            </div>
            <Button variant="outline" size="sm">
              One-click Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Calendars</h4>
                <p className="text-sm text-muted-foreground">Last update: 06/11/2025</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Labor Set</h4>
                <p className="text-sm text-muted-foreground">Last update: 06/11/2025</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Weather Pack (NYC)</h4>
                <p className="text-sm text-muted-foreground">Last update: 06/11/2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance (Delivery Model toggles) Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Governance (Delivery Model toggles)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set delivery model and policy-level toggles that influence overlaps and calendar behavior. These are owner-level guardrails, not scope edits.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable Early PO
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Delivery Model */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Delivery Model</h3>
                  <select className="w-full px-3 py-2 border rounded-md text-sm">
                    <option>CMAR (Construction Manager at Risk)</option>
                    <option>Design-Bid-Build</option>
                    <option>Design-Build</option>
                    <option>IPD (Integrated Project Delivery)</option>
                  </select>
                </div>
              </div>

              {/* Policy Toggles */}
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Policy Toggles</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <Checkbox checked />
                      <span className="text-sm">Allow Permit-Const overlap (Early Start)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox checked />
                      <span className="text-sm">Enable weather de-rates for exterior trades</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">Auto-adjust for supply chain constraints</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lineage & Approvals Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lineage & Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Every policy change writes lineage and, when required, an approval request.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Basis of Schedule Footer */}
        <div className="sticky bottom-0 bg-card border-t p-4 flex items-center justify-between">
          <h3 className="font-semibold">Save Basis of Schedule</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">BoS v1.0</Badge>
            <Button variant="outline" size="sm">Initial baseline</Button>
            <Button variant="outline" size="sm">Save as Version</Button>
            <Button size="sm">Apply (Delta Preview)</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

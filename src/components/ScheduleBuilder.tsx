import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  X, 
  ChevronDown, 
  Calendar as CalendarIcon,
  Undo2,
  Redo2,
  Eye,
  Circle,
  Square
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  phase: string;
  startMonth: number;
  duration: number;
  color: string;
  owner?: string;
  dependencies?: string[];
  isMilestone?: boolean;
}

const tasks: Task[] = [
  // Design Phase
  { id: "design-1", title: "SD - Site & Civil Con", phase: "Design", startMonth: 1, duration: 1.5, color: "bg-blue-400" },
  { id: "design-2", title: "DD - Architectural Concepts", phase: "Design", startMonth: 1.5, duration: 2, color: "bg-blue-300" },
  { id: "design-3", title: "SD - MEPF Concepts", phase: "Design", startMonth: 2, duration: 1.5, color: "bg-slate-400" },
  { id: "design-4", title: "DD - Arch/Struct 80d/5d", phase: "Design", startMonth: 3.5, duration: 3, color: "bg-blue-400", dependencies: ["design-2"] },
  { id: "design-5", title: "CD - MEPF 80d/5d", phase: "Design", startMonth: 3.5, duration: 3, color: "bg-blue-400", dependencies: ["design-3"] },
  { id: "design-6", title: "CDs - Arch/Struct 90d/FC", phase: "Design", startMonth: 6.5, duration: 2, color: "bg-slate-400", dependencies: ["design-4"] },
  // Permitting Phase
  { id: "permit-1", title: "Permit", phase: "Permitting", startMonth: 6, duration: 0, color: "bg-slate-600", isMilestone: true },
  { id: "permit-2", title: "Permit Submit", phase: "Permitting", startMonth: 7.5, duration: 0, color: "bg-slate-600", isMilestone: true },
  // Procurement Phase
  { id: "proc-1", title: "Long-Lead Procurement", phase: "Procurement", startMonth: 5.5, duration: 6, color: "bg-slate-400" },
];

const months = [
  "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", 
  "Jun 26", "Jul 26", "Aug 26", "Sep 26", "Oct 26", "Nov 26"
];

export function ScheduleBuilder() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0]);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const phases = [
    { name: "Design", milestones: 8, color: "bg-blue-50" },
    { name: "Permitting", milestones: 3, color: "bg-slate-50" },
    { name: "Procurement", milestones: 1, color: "bg-slate-50" },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold">Schedule Builder</h1>
            <p className="text-sm text-muted-foreground">
              Build and refine the pre-GC schedule with live canvas editing, dependency management, and staged changes
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Granularity */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Granularity:</span>
                <Button variant="ghost" size="sm" className="h-8">Minimal</Button>
                <Button variant="ghost" size="sm" className="h-8 bg-muted">Standard</Button>
                <Button variant="ghost" size="sm" className="h-8">Detailed-Lite</Button>
              </div>

              {/* Permit Lead Time */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Permit Lead Time:</span>
                <input 
                  type="text" 
                  defaultValue="35" 
                  className="w-16 px-2 py-1 border rounded text-sm text-center"
                />
              </div>

              {/* LLI Overlap */}
              <div className="flex items-center gap-2">
                <span className="text-sm">LLI Overlap (SS + days):</span>
                <input 
                  type="text" 
                  defaultValue="7" 
                  className="w-16 px-2 py-1 border rounded text-sm text-center"
                />
              </div>

              {/* Phase Buffer */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Phase Buffer:</span>
                <input 
                  type="text" 
                  defaultValue="3" 
                  className="w-16 px-2 py-1 border rounded text-sm text-center"
                />
              </div>

              {/* Calendar */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Calendar:</span>
                <span className="text-sm font-medium">Mon-Sat</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Snapshot Preview
              </Button>
              <Button variant="ghost" size="icon">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button className="bg-primary">
                Publish Baseline v1.0
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Inspector Panel */}
        {inspectorOpen && selectedTask && (
          <div className="w-64 border-r bg-background p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Inspector</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setInspectorOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <input 
                  type="text" 
                  value={selectedTask.title}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  readOnly
                />
              </div>

              {/* Phase */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Phase</label>
                <Select defaultValue={selectedTask.phase}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Permitting">Permitting</SelectItem>
                    <SelectItem value="Procurement">Procurement</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Owner */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Owner</label>
                <Select defaultValue="Architect">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Architect">Architect</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select defaultValue="In Progress">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Planned Start</label>
                  <div className="flex items-center gap-1 border rounded-md px-2 py-1.5">
                    <input 
                      type="text" 
                      defaultValue="16/12/2025"
                      className="w-full text-sm outline-none"
                    />
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Planned Finish</label>
                  <div className="flex items-center gap-1 border rounded-md px-2 py-1.5">
                    <input 
                      type="text" 
                      defaultValue="10/01/2026"
                      className="w-full text-sm outline-none"
                    />
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* External Wait */}
              <div className="flex items-center space-x-2">
                <Checkbox id="external-wait" />
                <label htmlFor="external-wait" className="text-sm">External Wait</label>
              </div>

              {/* Dependencies */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Dependencies</label>
                <div className="text-sm text-muted-foreground">Gate Approvers</div>
                <div className="text-sm">Owner, Architect</div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Notes</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px] resize-none"
                  placeholder="Add notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Gantt Chart Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Legend */}
            <div className="mb-4 flex items-center gap-6 text-xs bg-muted/30 p-3 rounded-lg">
              <span className="font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-red-500 rounded"></div>
                <span>Critical (≤2d float)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-amber-400 rounded"></div>
                <span>Near-Critical (3-5d float)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-green-400 rounded"></div>
                <span>Safe (&gt;5d float)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-slate-400 rounded"></div>
                <span>Task (duration &gt; 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-600 rotate-45"></div>
                <span>Milestone (duration = 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">↔</span>
                <span>Hover to resize</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">→</span>
                <span>Dependency</span>
              </div>
            </div>

            {/* Gantt Timeline */}
            <div className="relative">
              {/* Timeline Header */}
              <div className="flex border-b bg-muted/50">
                <div className="w-48 flex-shrink-0"></div>
                <div className="flex-1 flex">
                  {months.map((month, i) => (
                    <div 
                      key={i} 
                      className="flex-1 min-w-[80px] px-2 py-2 text-xs font-medium text-center border-l"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases and Tasks */}
              {phases.map((phase, phaseIdx) => (
                <div key={phaseIdx} className={`border-b ${phase.color}`}>
                  {/* Phase Header */}
                  <div className="flex items-center py-2 border-b">
                    <div className="w-48 flex-shrink-0 px-4 flex items-center justify-between">
                      <span className="font-semibold text-sm">{phase.name}</span>
                      <span className="text-xs text-muted-foreground">{phase.milestones} milestones</span>
                    </div>
                    <div className="flex-1"></div>
                  </div>

                  {/* Tasks for this phase */}
                  {tasks
                    .filter(task => task.phase === phase.name)
                    .map((task, taskIdx) => (
                      <div 
                        key={taskIdx} 
                        className="flex items-center py-2 hover:bg-muted/50 cursor-pointer group relative"
                        onClick={() => setSelectedTask(task)}
                      >
                        {/* Task Name */}
                        <div className="w-48 flex-shrink-0 px-4">
                          <div className="text-xs">{task.title}</div>
                        </div>

                        {/* Timeline Grid */}
                        <div className="flex-1 flex relative" style={{ height: '40px' }}>
                          {/* Grid lines */}
                          {months.map((_, i) => (
                            <div 
                              key={i} 
                              className="flex-1 min-w-[80px] border-l"
                            ></div>
                          ))}

                          {/* Task Bar */}
                          {task.isMilestone ? (
                            <div 
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{
                                left: `${(task.startMonth / 12) * 100}%`,
                              }}
                            >
                              <div className={`w-3 h-3 ${task.color} rotate-45 border border-slate-600`}></div>
                            </div>
                          ) : (
                            <div 
                              className={`absolute ${task.color} rounded px-2 py-1 shadow-sm hover:shadow-md transition-shadow`}
                              style={{
                                left: `${(task.startMonth / 12) * 100}%`,
                                width: `${(task.duration / 12) * 100}%`,
                                top: '8px',
                                height: '24px',
                              }}
                            >
                              <div className="text-[10px] text-white font-medium truncate">
                                {task.title}
                              </div>
                            </div>
                          )}

                          {/* Dependency Arrows */}
                          {task.dependencies && task.dependencies.map((depId, i) => {
                            const depTask = tasks.find(t => t.id === depId);
                            if (!depTask) return null;
                            
                            const startX = ((depTask.startMonth + depTask.duration) / 12) * 100;
                            const endX = (task.startMonth / 12) * 100;
                            
                            return (
                              <svg 
                                key={i}
                                className="absolute inset-0 pointer-events-none"
                                style={{ width: '100%', height: '100%' }}
                              >
                                <defs>
                                  <marker
                                    id={`arrowhead-${task.id}-${i}`}
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon 
                                      points="0 0, 10 3, 0 6" 
                                      fill="hsl(var(--muted-foreground))"
                                    />
                                  </marker>
                                </defs>
                                <line
                                  x1={`${startX}%`}
                                  y1="20"
                                  x2={`${endX}%`}
                                  y2="20"
                                  stroke="hsl(var(--muted-foreground))"
                                  strokeWidth="1.5"
                                  markerEnd={`url(#arrowhead-${task.id}-${i})`}
                                />
                              </svg>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

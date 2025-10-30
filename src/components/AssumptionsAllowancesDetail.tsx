import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Edit, ChevronDown } from "lucide-react";

interface AssumptionsAllowancesDetailProps {
  onBack: () => void;
}

export function AssumptionsAllowancesDetail({ onBack }: AssumptionsAllowancesDetailProps) {
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
              <h2 className="text-xl font-semibold">Assumptions & Allowances</h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive scope definition and clarifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <span className="mr-2">+</span>
              Add Item
            </Button>
            <Button variant="outline" size="sm" className="text-purple-600">
              Ask AI
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Assumptions</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">3 items</Badge>
              </div>
              <div className="text-2xl font-bold text-blue-600">Total: $1,620,000</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Allowances</h3>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">3 items</Badge>
              </div>
              <div className="text-2xl font-bold text-yellow-600">Total: $2,130,000</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Clarifications & Exclusions</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">6 items</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">3 clarifications, 3 exclusions</div>
            </Card>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Assumptions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Assumptions</h3>
              
              {/* Assumption 1 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Roof top playground</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Owner requires a dedicated playground area on the roof deck for children's recreation. 
                  This includes safety surfacing, play equipment, and perimeter fencing.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: E001 - Playground</div>
                  <div className="text-muted-foreground">
                    Basis: Owner program requirement - Based on RSMeans playground construction 
                    costs at $85/SF for 5,300 SF area
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">High</Badge>
                  <div className="text-sm font-semibold">$450,000</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-blue-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>

              {/* Assumption 2 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Exterior terrace scope</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Large outdoor terrace space with premium finishes, outdoor kitchen, and seating 
                  areas. Scope includes structural support, waterproofing, and high-end finishes.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: A600 - Exterior</div>
                  <div className="text-muted-foreground">
                    Basis: Pending owner decision - Estimated based on similar luxury terrace 
                    projects at $120/SF for 7,100 SF
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Low</Badge>
                  <div className="text-sm font-semibold">$850,000</div>
                  <div className="text-xs text-muted-foreground">Design Team</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-blue-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>

              {/* Assumption 3 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Premium finishes in lobby</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  High-end lobby finishes including imported marble, custom millwork, and 
                  designer lighting fixtures to create an impressive first impression.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: A100 - Lobby</div>
                  <div className="text-muted-foreground">
                    Basis: Design intent - Based on premium finish specifications at $180/SF for 
                    1,780 SF lobby area
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">High</Badge>
                  <div className="text-sm font-semibold">$320,000</div>
                  <div className="text-xs text-muted-foreground">Design Team</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-blue-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>
            </div>

            {/* Allowances */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Allowances</h3>
              
              {/* Allowance 1 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">IT/AV allowances</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Comprehensive IT infrastructure including structured cabling, network equipment, 
                  AV systems, and security cameras. Allowance covers tenant-specific requirements.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: IT & AV Systems</div>
                  <div className="text-muted-foreground">
                    Basis: TBD by tenant - Based on industry standard IT/AV allowances at $8.50/SF 
                    for 141,000 SF building
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
                  <div className="text-sm font-semibold">$1,200,000</div>
                  <div className="text-xs text-muted-foreground">TBD</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-yellow-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>

              {/* Allowance 2 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Furniture & Equipment</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Office furniture, workstations, conference room furniture, and specialized 
                  equipment. Allowance includes delivery, installation, and setup.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: Furniture Allowance</div>
                  <div className="text-muted-foreground">
                    Basis: Owner procurement - Based on typical office furniture costs at $5.30/SF 
                    for 141,000 SF building
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>
                  <div className="text-sm font-semibold">$750,000</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
              </Card>

              {/* Allowance 3 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Artwork & Signage</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Custom artwork, wayfinding signage, and brand elements throughout the 
                  building. Includes design, fabrication, and installation.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: Art & Signage</div>
                  <div className="text-muted-foreground">
                    Basis: Brand guidelines - Based on corporate art and signage budgets at 
                    $1.28/SF for 141,000 SF building
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">Low</Badge>
                  <div className="text-sm font-semibold">$180,000</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-yellow-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>
            </div>

            {/* Clarifications & Exclusions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Clarifications & Exclusions</h3>
              
              {/* Clarifications */}
              <div className="text-xs font-medium text-muted-foreground mb-2">Clarifications</div>
              
              {/* Clarification 1 */}
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Structural steel connections</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  All structural steel connections must be designed and detailed by a licensed 
                  structural engineer. This includes moment connections, bolted connections, and 
                  welded joints.
                </p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-muted-foreground">Scope: C05 - Structural Steel</div>
                  <div className="text-muted-foreground">
                    Basis: Engineer review required - No additional cost impact, included in 
                    structural engineering fees
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">High</Badge>
                  <div className="text-xs text-muted-foreground">Structural Engineer</div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-7 text-green-600">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Scroll for more
                </Button>
              </Card>
            </div>
          </div>

          {/* Cost Summary */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-4">Cost Summary</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$1,620,000</div>
                <div className="text-sm text-muted-foreground mt-1">Assumptions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">$2,130,000</div>
                <div className="text-sm text-muted-foreground mt-1">Allowances</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">6</div>
                <div className="text-sm text-muted-foreground mt-1">Clarifications & Exclusions</div>
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm" className="text-purple-600">
                  Ask AI: "Analyze cost impact"
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

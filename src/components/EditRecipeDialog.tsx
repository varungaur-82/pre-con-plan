import { useState } from "react";
import { X, Eye, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EditRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCode: string;
  itemDescription: string;
}

export function EditRecipeDialog({
  open,
  onOpenChange,
  itemCode,
  itemDescription,
}: EditRecipeDialogProps) {
  const [scopeOfChanges, setScopeOfChanges] = useState<"this-line" | "all-children" | "all-matching">("this-line");
  const [finishTier, setFinishTier] = useState<"basic" | "standard" | "high">("standard");
  const [sourceType, setSourceType] = useState("RSMeans");
  const [city, setCity] = useState("NYC");
  const [generalReq, setGeneralReq] = useState("8.5");
  const [ohpCmFee, setOhpCmFee] = useState("10");
  const [bondInsurance, setBondInsurance] = useState("1.5");
  const [salesTax, setSalesTax] = useState("8.25");
  const [contingencyType, setContingencyType] = useState("Construction");
  const [contingencyValue, setContingencyValue] = useState("12");
  const [allowance, setAllowance] = useState(false);
  const [lockRow, setLockRow] = useState(false);

  const handleApply = () => {
    // Handle apply logic here
    console.log("Applying changes...");
    onOpenChange(false);
  };

  const handlePreview = () => {
    // Handle preview logic here
    console.log("Previewing changes...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold">Edit Recipe</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {itemCode} - {itemDescription}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scope of Changes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Scope of Changes</Label>
            <div className="flex gap-2">
              <Button
                variant={scopeOfChanges === "this-line" ? "default" : "outline"}
                onClick={() => setScopeOfChanges("this-line")}
                className="flex-1"
              >
                This Line
              </Button>
              <Button
                variant={scopeOfChanges === "all-children" ? "default" : "outline"}
                onClick={() => setScopeOfChanges("all-children")}
                className="flex-1"
              >
                All Children (0 lines)
              </Button>
              <Button
                variant={scopeOfChanges === "all-matching" ? "default" : "outline"}
                onClick={() => setScopeOfChanges("all-matching")}
                className="flex-1"
              >
                All Matching
              </Button>
            </div>
          </div>

          {/* Finish Tier */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Finish Tier</Label>
            <div className="flex gap-2">
              <Button
                variant={finishTier === "basic" ? "default" : "outline"}
                onClick={() => setFinishTier("basic")}
                className="flex-1"
              >
                Basic
              </Button>
              <Button
                variant={finishTier === "standard" ? "default" : "outline"}
                onClick={() => setFinishTier("standard")}
                className="flex-1"
              >
                Standard
              </Button>
              <Button
                variant={finishTier === "high" ? "default" : "outline"}
                onClick={() => setFinishTier("high")}
                className="flex-1"
              >
                High
              </Button>
            </div>
          </div>

          {/* Source Type and City */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Source Type</Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RSMeans">RSMeans</SelectItem>
                  <SelectItem value="Craftsman">Craftsman</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold">City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          {/* Commercial Markups */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Commercial Markups (%)</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">General Requirements</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={generalReq}
                  onChange={(e) => setGeneralReq(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">OH&P / CM Fee</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={ohpCmFee}
                  onChange={(e) => setOhpCmFee(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Bond & Insurance</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bondInsurance}
                  onChange={(e) => setBondInsurance(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Sales/Use Tax</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={salesTax}
                  onChange={(e) => setSalesTax(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contingency */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Contingency</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select value={contingencyType} onValueChange={setContingencyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="1"
                value={contingencyValue}
                onChange={(e) => setContingencyValue(e.target.value)}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowance"
                checked={allowance}
                onCheckedChange={(checked) => setAllowance(checked as boolean)}
              />
              <Label htmlFor="allowance" className="text-base cursor-pointer">
                Allowance
              </Label>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lock-row"
                  checked={lockRow}
                  onCheckedChange={(checked) => setLockRow(checked as boolean)}
                />
                <Label htmlFor="lock-row" className="text-base cursor-pointer">
                  Lock Row
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Locked rows are protected from AI edits
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="px-8"
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleApply} className="gap-2 px-8">
              <Save className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

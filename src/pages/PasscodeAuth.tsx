import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface PasscodeAuthProps {
  onAuthenticated: () => void;
}

// Valid passcodes for application access
const VALID_PASSCODES = ["K8M2P9", "R5X3N7", "Q4W6Y2"];

export function PasscodeAuth({ onAuthenticated }: PasscodeAuthProps) {
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const normalizedPasscode = passcode.trim().toUpperCase();

    if (VALID_PASSCODES.includes(normalizedPasscode)) {
      localStorage.setItem("app_authenticated", "true");
      toast.success("Access granted");
      onAuthenticated();
    } else {
      toast.error("Invalid passcode. Please try again.");
      setPasscode("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">ConstructPlan</h1>
          <p className="text-muted-foreground">Enter passcode to access the application</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="text-center text-lg tracking-widest uppercase"
              maxLength={6}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || passcode.length === 0}
          >
            {isSubmitting ? "Verifying..." : "Access Application"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <p>Authorized access only</p>
        </div>
      </div>
    </div>
  );
}

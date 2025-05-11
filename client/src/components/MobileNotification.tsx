import { useIsMobile } from "@/hooks/useIsMobile";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MobileNotification() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);

  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
      <Alert className="bg-white border-2 border-[var(--brand-blue)] shadow-lg">
        <AlertDescription className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-pulse" />
            <span className="text-[var(--brand-blue)] font-medium">
              This site is best viewed on desktop
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 hover:bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

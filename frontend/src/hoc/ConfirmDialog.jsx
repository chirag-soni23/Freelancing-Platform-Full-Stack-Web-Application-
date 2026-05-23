import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "Please confirm if you want to proceed with this action. This process cannot be undone.",
  onConfirm,
  loading = false,
  confirmText = "Confirm Action",
  loadingText = "Processing...",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] gap-0 rounded-xl border border-border/40 bg-card/70 backdrop-blur-xl p-6 shadow-card focus-visible:outline-hidden">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-soft animate-pulse-slow">
            <AlertTriangle size={22} strokeWidth={2} />
          </div>

          <div className="space-y-2 flex-1 w-full">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium leading-relaxed text-muted-foreground/90">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* REFINED SYSTEM BUTTONS (Premium & Rounded) */}
        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-11 rounded-xl border-border/60 bg-transparent text-sm font-semibold text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground disabled:opacity-40 sm:px-5"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-11 rounded-xl bg-destructive text-sm font-semibold text-destructive-foreground transition-smooth hover:bg-destructive/90 shadow-soft disabled:opacity-50 sm:px-5"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span>{loadingText}</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
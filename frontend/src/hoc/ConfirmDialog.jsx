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
      <DialogContent className="sm:max-w-[420px] gap-0 rounded-2xl border border-neutral-200/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl transition-all dark:border-neutral-800/60 dark:bg-neutral-950/80 focus-visible:outline-none">
        {/* HEADER & CONTENT LAYOUT */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          {/* SOPHISTICATED DESTRUCTIVE ICON */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-200/60 bg-red-50 text-red-600 shadow-sm dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
            <AlertTriangle
              size={20}
              strokeWidth={2.2}
              className="animate-bounce-slow"
            />
          </div>

          {/* TEXT CONTENT */}
          <div className="space-y-1.5 flex-1 w-full">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* REFINED SYSTEM BUTTONS */}
        <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-10 rounded-xl border-neutral-200 bg-white text-xs font-medium tracking-wide text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40 sm:px-4 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-10 min-w-[120px] rounded-xl bg-red-600 text-xs font-medium tracking-wide text-white shadow-md transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 sm:px-4 dark:bg-red-500 dark:hover:bg-red-600"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
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

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, AlertCircle, HelpCircle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  variant = "destructive",
  confirmText = "Confirm",
  loading = false,
}) => {
  const variantStyles = {
    destructive: {
      icon: <Trash2 className="text-destructive" size={28} />,
      bg: "bg-destructive/10",
      btn: "bg-destructive text-white hover:bg-destructive/90",
    },
    warning: {
      icon: <AlertCircle className="text-orange-500" size={28} />,
      bg: "bg-orange-500/10",
      btn: "bg-orange-500 text-white hover:bg-orange-600",
    },
    info: {
      icon: <HelpCircle className="text-primary" size={28} />,
      bg: "bg-primary/10",
      btn: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
  };

  const style = variantStyles[variant] || variantStyles.destructive;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-border/40 sm:max-w-[425px]">

        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-3">

            {/* Icon */}
            <div className={`w-16 h-16 rounded-full ${style.bg} flex items-center justify-center`}>
              {style.icon}
            </div>

            <DialogTitle className="text-2xl font-bold gradient-text">
              {title}
            </DialogTitle>

            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 mt-6">

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full bg-secondary/50 border border-border py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold ${style.btn}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
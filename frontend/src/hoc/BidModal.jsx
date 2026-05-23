import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Gavel, CalendarDays, Loader2 } from "lucide-react";

import { useBid } from "@/hooks/useBid";
import { bidSchema } from "@/validations/bid.validator";

const BidModal = ({ isOpen, onClose, job }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [proposal, setProposal] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  
  const [errors, setErrors] = useState({});

  const { createBid, isCreatingBid } = useBid();

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setProposal("");
      setDeliveryDays("");
      setCurrency(job?.currency || "INR");
      setErrors({});
    }
  }, [isOpen, job]);

  const handleInputChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreatingBid) return;

    const formData = {
      amount: amount === "" ? undefined : Number(amount),
      currency,
      proposal: proposal.trim(),
      deliveryDays: deliveryDays === "" ? undefined : Number(deliveryDays),
    };

    const { error } = bidSchema.validate(formData, { abortEarly: false });

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return; 
    }

    createBid(
      {
        jobId: job?.id,
        ...formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={isCreatingBid ? null : onClose}>
      <DialogContent
        className="
          sm:max-w-[550px]
          rounded-xl
          p-6
          md:p-8
          bg-white
          dark:bg-[#0f172a]
          border
          border-border/50
          shadow-2xl
        "
      >
        <DialogHeader className="space-y-3 text-left">
          <div className="flex items-center justify-start gap-5">
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-primary/10
                flex
                items-center
                justify-center
                text-primary
                shrink-0
              "
            >
              <Gavel size={22} />
            </div>

            <div>
              <DialogTitle className="text-2xl font-black">
                Place Your Bid
              </DialogTitle>

              <DialogDescription className="text-sm mt-1">
                Bidding for{" "}
                <span className="font-semibold text-foreground">
                  {job?.title}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2" noValidate>
          {/* Amount + Currency */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              Bid Amount
            </Label>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  {currency === "INR" ? "₹" : "$"}
                </span>

                <Input
                  type="number"
                  disabled={isCreatingBid}
                  value={amount}
                  onChange={(e) => handleInputChange("amount", e.target.value, setAmount)}
                  placeholder="9000"
                  className={`pl-10 h-12 rounded-xl bg-secondary/5 ${
                    errors.amount ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
              </div>

              <Select
                value={currency}
                onValueChange={(val) => handleInputChange("currency", val, setCurrency)}
                disabled={isCreatingBid}
              >
                <SelectTrigger className="w-[120px] h-12 rounded-xl bg-secondary/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.amount && (
              <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in-50 duration-200">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Delivery */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              Delivery Days
            </Label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                type="number"
                disabled={isCreatingBid}
                value={deliveryDays}
                onChange={(e) => handleInputChange("deliveryDays", e.target.value, setDeliveryDays)}
                placeholder="7"
                className={`pl-12 h-12 rounded-xl ${
                  errors.deliveryDays ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.deliveryDays && (
              <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in-50 duration-200">
                {errors.deliveryDays}
              </p>
            )}
          </div>

          {/* Proposal */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              Proposal
            </Label>

            <Textarea
              rows={5}
              disabled={isCreatingBid}
              value={proposal}
              onChange={(e) => handleInputChange("proposal", e.target.value, setProposal)}
              placeholder="Describe your experience and approach..."
              className={`rounded-xl resize-none p-4 ${
                errors.proposal ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
            {errors.proposal && (
              <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in-50 duration-200">
                {errors.proposal}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isCreatingBid}
              onClick={onClose}
              className="rounded-xl h-12"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isCreatingBid} className="rounded-xl h-12">
              {isCreatingBid ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Bid"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
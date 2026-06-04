import { useEffect, useState } from "react";
import { Loader2, Link2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSubmission } from "@/hooks/useSubmission";

const SubmissionDialog = ({
  open,
  onOpenChange,
  bidId,
  initialValue = "",
  isEdit = false,
}) => {
  const [submissionUrl, setSubmissionUrl] = useState("");

  const { createSubmission, updateSubmission, isCreating, isUpdating } =
    useSubmission(bidId);

  useEffect(() => {
    if (open) {
      setSubmissionUrl(initialValue || "");
    }
  }, [open, initialValue]);
  const handleSubmit = () => {
    if (!submissionUrl.trim()) return;

    const payload = {
      submissionUrl: submissionUrl.trim(),
    };

    const action = isEdit ? updateSubmission : createSubmission;

    action(payload, {
      onSuccess: () => {
        setSubmissionUrl("");
        onOpenChange(false);
      },
    });
  };

  const loading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Project Link" : "Submit Project"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update your submitted project URL."
              : "Submit your GitHub repository, Vercel deployment, Drive folder or any public project URL."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/chirag/project"
              className="pl-10"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            disabled={!submissionUrl.trim() || loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Submitting..."}
              </>
            ) : isEdit ? (
              "Update Link"
            ) : (
              "Submit Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDialog;

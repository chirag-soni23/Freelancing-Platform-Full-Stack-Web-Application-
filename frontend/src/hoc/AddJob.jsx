import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Briefcase,
  IndianRupee,
  BadgeCheck,
  DollarSign,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJobSchema } from "@/validations/job.validator";
import { useJob } from "@/hooks/useJob";

const AddJob = ({
  open,
  setOpen,
  selectedJob,
  setSelectedJob,
  editId,
  setEditId,
}) => {
  const { createJob, isCreatingJob, updateJob, isUpdatingJob } = useJob();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [level, setLevel] = useState("Entry");
  const [employment, setEmployment] = useState("Contract");
  const [jobType, setJobType] = useState("Remote");

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().toLowerCase();
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      budget: Number(budget),
      currency,
      level,
      employment,
      jobType,
      skills,
    };

    const { error } = createJobSchema.validate(data, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      if (editId) {
        await updateJob({
          id: editId,
          data,
        });
      } else {
        await createJob(data);
      }

      setTitle("");
      setDescription("");
      setBudget("");
      setCurrency("INR");
      setSkills([]);
      setSkillInput("");
      setSelectedJob(null);
      setEditId(null);
      setLevel("Entry");
      setEmployment("Contract");
      setJobType("Remote");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedJob) {
      setTitle(selectedJob.title);
      setDescription(selectedJob.description);
      setBudget(selectedJob.budget);
      setCurrency(selectedJob.currency);
      setSkills(selectedJob.skills || []);

      setLevel(selectedJob.level || "Entry");
      setEmployment(selectedJob.employment || "Contract");
      setJobType(selectedJob.jobType || "Remote");
    }
  }, [selectedJob]);
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSelectedJob(null);
          setEditId(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px] p-0 border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl rounded-[1.5rem] overflow-hidden">
        {/* Header - Fixed */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <span className="text-foreground">Create New Job</span>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="px-6 py-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="grid gap-6 pb-4">
            {/* Job Title */}
            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                Job Title
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="e.g. Senior React Developer"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className="pl-10 h-12 bg-background/50 border-border/60 rounded-xl focus:ring-primary shadow-inner"
                />
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 ml-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor="desc"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                Project Description
              </Label>
              <Textarea
                id="desc"
                placeholder="Describe the project goals and requirements..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                className="min-h-[120px] bg-background/50 border-border/60 rounded-xl resize-none p-4 focus-visible:ring-primary shadow-inner"
              />
              {errors.description && (
                <p className="text-xs text-red-500 ml-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Budget & Currency - Fix Applied Here */}
            <div className="grid grid-cols-2 gap-4 items-start">
              {/* Budget */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Budget
                </Label>

                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setErrors((prev) => ({ ...prev, budget: "" }));
                    }}
                    className="pl-10 h-12 bg-background/50 border-border/60 rounded-xl shadow-inner"
                  />

                  {currency === "INR" ? (
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  ) : (
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {errors.budget && (
                  <p className="text-xs text-red-500 ml-1">{errors.budget}</p>
                )}
              </div>

              {/* Currency */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Currency
                </Label>

                <Select
                  value={currency}
                  onValueChange={(value) => {
                    setCurrency(value);
                    setErrors((prev) => ({ ...prev, currency: "" }));
                  }}
                >
                  <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60 ">
                    <SelectItem value="INR" className="py-3 rounded-lg">
                      INR (₹)
                    </SelectItem>
                    <SelectItem value="USD" className="py-3 rounded-lg">
                      USD ($)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors.currency && (
                  <p className="text-xs text-red-500 ml-1">{errors.currency}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Level
                </Label>

                <Select
                  value={level}
                  onValueChange={(value) => {
                    setLevel(value);
                    setErrors((prev) => ({ ...prev, level: "" }));
                  }}
                >
                  <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60">
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>

                {errors.level && (
                  <p className="text-xs text-red-500 ml-1">{errors.level}</p>
                )}
              </div>

              {/* Employment */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Employment
                </Label>

                <Select
                  value={employment}
                  onValueChange={(value) => {
                    setEmployment(value);
                    setErrors((prev) => ({ ...prev, employment: "" }));
                  }}
                >
                  <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm">
                    <SelectValue placeholder="Select employment" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60">
                    <SelectItem value="Contract">Contract</SelectItem>

                    <SelectItem value="Full-time">Full-time</SelectItem>

                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>

                {errors.employment && (
                  <p className="text-xs text-red-500 ml-1">
                    {errors.employment}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Job Type
                </Label>

                <Select
                  value={jobType}
                  onValueChange={(value) => {
                    setJobType(value);
                    setErrors((prev) => ({ ...prev, jobType: "" }));
                  }}
                >
                  <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60">
                    <SelectItem value="Remote">Remote</SelectItem>

                    <SelectItem value="On-site">On-site</SelectItem>

                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>

                {errors.jobType && (
                  <p className="text-xs text-red-500 ml-1">{errors.jobType}</p>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="grid gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Required Skills
              </Label>
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setErrors((prev) => ({ ...prev, skills: "" }));
                }}
                onKeyDown={handleAddSkill}
                className="h-12 bg-background/50 border-border/60 rounded-xl shadow-inner"
              />

              <div className="flex flex-wrap gap-2 mt-1">
                {skills.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic ml-1">
                    No skills added yet.
                  </p>
                )}
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 rounded-lg flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 group hover:bg-primary/20 transition-all shadow-sm"
                  >
                    <span className="font-semibold capitalize text-[12px]">
                      {skill}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(skill)}
                      className="h-6 w-6 rounded-full hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {errors.skills && (
            <p className="text-xs text-red-500 ml-1">{errors.skills}</p>
          )}
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="p-6 border-t border-border/40 bg-background/20">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl h-11 font-bold px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreatingJob || isUpdatingJob}
            className="gradient-primary text-white h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            {isUpdatingJob
              ? "Updating..."
              : isCreatingJob
                ? "Creating..."
                : selectedJob
                  ? "Update Job"
                  : "Launch Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddJob;

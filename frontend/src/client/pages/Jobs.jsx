import React, { useState } from "react";
import {
  Search,
  Plus,
  Clock,
  MoreHorizontal,
  Edit3,
  Trash2,
  Zap,
  BadgeAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddJob from "@/hoc/AddJob";
import { useJob } from "@/hooks/useJob";
import WithPagination from "@/hoc/WithPagination";
import useDebounce from "@/hooks/useDebounce";
import ConfirmDialog from "@/hoc/ConfirmDialog";

const Jobs = () => {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { jobs, pagination, toggleStatus, deleteJob, isDeletingJob } = useJob(
    null,
    {
      page,
      limit: 10,
      search: debouncedSearch,
    },
  );
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen text-foreground p-8 transition-theme">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            My Jobs
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your active listings and find the perfect freelancer.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-elegant hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Job
        </button>
      </div>

      <div className="max-w-8xl mx-auto mb-10 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects by title or skills..."
            className="pl-10 h-12 bg-card border-border/50 rounded-xl focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="flex">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-elegant hover:opacity-90 transition-all active:scale-95">
            Search
          </button>
        </div>
      </div>

      <div className="max-w-8xl mx-auto space-y-10">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className="group relative overflow-hidden border-none bg-background/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[24px]"
            >
              {/* Top Accent Gradient Line */}
              {/* <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}

              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main Content Area */}
                  <div className="p-8 flex-1 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                          job.status.toLowerCase() === "open"
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                            : "bg-red-500/5 text-red-500 border-red-500/20"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full animate-pulse ${job.status.toLowerCase() === "open" ? "bg-emerald-500" : "bg-red-400"}`}
                        />
                        {job.status}
                      </div>
                      <div className="h-4 w-[1px] bg-border/60" />
                      <span className="text-xs font-medium text-muted-foreground/60 flex items-center gap-1.5">
                        <Clock size={14} className="opacity-70" />
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4 group-hover:translate-x-1 transition-transform duration-300">
                      {job.title}
                    </h2>

                    <p className="text-muted-foreground/80 leading-relaxed text-base max-w-3xl mb-8 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Enhanced Skill Badges */}
                    <div className="flex flex-wrap gap-2.5">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-1.5 rounded-xl bg-secondary/50 text-secondary-foreground text-xs font-semibold border border-transparent hover:border-primary/20 hover:bg-background transition-all cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Premium Sidebar Area */}
                  <div className="lg:w-72 bg-secondary/10 p-8 flex flex-row lg:flex-col justify-between items-center lg:items-center border-t lg:border-t-0 lg:border-l border-border/10">
                    <div className="text-left lg:text-center space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                        Valuation
                      </p>
                      <div className="text-4xl font-black tracking-tighter text-foreground flex items-center justify-start lg:justify-center">
                        <span className="text-primary mr-1">
                          {job.currency?.toUpperCase() === "INR" ? "₹" : "$"}
                        </span>
                        {job.budget.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-[160px] lg:max-w-full lg:mt-10">
                      <div className="hidden lg:flex items-center justify-around w-full mb-2">
                        <div className="text-center">
                          <p className="text-xl font-bold text-foreground">
                            {job.bidCount}
                          </p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">
                            Proposals
                          </p>
                        </div>
                        <div className="h-8 w-[1px] bg-border/20" />
                        <div className="text-center">
                          <p className="text-xl font-bold text-foreground">0</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">
                            Views
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* View */}
                        <Button className="flex-1 h-12 rounded-2xl font-bold bg-primary hover:bg-primary/90 shadow-[0_10px_20px_rgba(var(--primary),0.2)] transition-all active:scale-95">
                          View
                        </Button>

                        {/* Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 rounded-2xl border-border/40 bg-background hover:bg-secondary transition-all"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 rounded-2xl shadow-2xl border-border/40 backdrop-blur-xl"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setEditId(job.id);
                                setSelectedJob(job);
                                setOpen(true);
                              }}
                              className="rounded-xl py-3 cursor-pointer"
                            >
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Listing
                            </DropdownMenuItem>

                            {/* Toggle inside dropdown */}
                            <DropdownMenuItem
                              onClick={() => toggleStatus(job.id)}
                              className={`rounded-xl py-3 cursor-pointer ${
                                job.status === "open"
                                  ? "text-destructive focus:text-destructive"
                                  : "text-emerald-600 focus:text-emerald-600"
                              }`}
                            >
                              <BadgeAlert />{" "}
                              {job.status === "open" ? "Close Job" : "Open Job"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setDeleteId(job.id);
                                setConfirmOpen(true);
                              }}
                              className="rounded-xl py-3 cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          /* Empty State */
          <div className="relative overflow-hidden py-24 px-10 text-center rounded-[40px] border border-dashed border-border/60 bg-gradient-to-b from-card/50 to-transparent">
            <div className="relative z-10">
              <div className="inline-flex p-6 rounded-[30px] bg-primary/5 mb-6 text-primary border border-primary/10">
                <Zap size={40} className="fill-primary/20" />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-3">
                No active listings
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed">
                Create your first job posting and start collaborating with
                world-class talent today.
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="h-14 px-10 rounded-2xl text-lg font-bold gap-3 hover:scale-105 transition-transform"
              >
                <Plus size={22} strokeWidth={3} /> Post a Job
              </Button>
            </div>
          </div>
        )}
      </div>
      <WithPagination
        page={page}
        totalPages={pagination?.totalPages}
        onPageChange={setPage}
      />
      <AddJob
        open={open}
        setOpen={setOpen}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        editId={editId}
        setEditId={setEditId}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          deleteJob(deleteId, {
            onSuccess: () => {
              setConfirmOpen(false);
              setDeleteId(null);
            },
          });
        }}
        title="Delete Job?"
        description="This job will be permanently deleted. You cannot undo this action."
        confirmText="Delete"
        loading={isDeletingJob}
      />
    </div>
  );
};

export default Jobs;

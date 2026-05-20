import React, { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import WithPagination from "@/hoc/WithPagination";
import useDebounce from "@/hooks/useDebounce";
import { 
  Briefcase, 
  Search, 
  X, 
  Calendar, 
  Layers, 
  User, 
  Loader2, 
  DollarSign, 
  Users, 
  Activity 
} from "lucide-react";

const AdminJobs = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    jobs = [],
    isLoading,
    isFetching,
    jobsPagination: pagination,
  } = useDashboard("admin", {
    page,
    limit: 10,
    search: debouncedSearch,
  }, "jobs");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatBudget = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading && !jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Loading jobs directory...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen transition-colors duration-500">
      <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
            Jobs Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Overview, monitor, and manage user-posted jobs across categories.
          </p>
        </div>

        {/* Search Input Control */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (page !== 1) {
                setPage(1);
              }
            }}
            placeholder="Search jobs by title or client..."
            className="h-12 w-full pl-11 pr-11 rounded-full bg-card border-border/60 shadow-soft"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Core Main View */}
        {jobs.length > 0 ? (
          <div className={isFetching ? "opacity-70 transition-all" : "transition-all"}>
            
            {/* 1. Mobile & Small Screen Card Layout (Hidden on Desktop) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="glass rounded-2xl border border-border/40 p-5 space-y-4 shadow-card group"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold block text-foreground tracking-tight text-base leading-snug line-clamp-2">
                        {job.title}
                      </span>
                      <Badge variant={job.status === "open" ? "default" : "secondary"} className="capitalize">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Layers size={12} />
                      <span>{job.category?.name}</span>
                    </div>
                  </div>

                  <hr className="border-border/40" />

                  {/* Metadata fields */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground block">Client</span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <User size={13} className="text-muted-foreground/70" />
                        <span className="truncate">{job.client?.name || "Unknown"}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground block">Budget</span>
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <span>{formatBudget(job.budget, job.currency)}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground block">Experience Level</span>
                      <span className="font-medium text-xs bg-secondary/60 px-2 py-0.5 rounded-md inline-block w-fit">
                        {job.level}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs text-muted-foreground block">Bids Count</span>
                      <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground">
                        <Users size={13} />
                        <span>{job.bidCount} proposals</span>
                      </div>
                    </div>
                  </div>

                  {/* Render inline skill chips array */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span 
                          key={skill} 
                          className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/10 capitalize"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 2. Professional Desktop Table Layout (Hidden on Mobile) */}
            <div className="hidden md:block glass rounded-[2rem] overflow-hidden border border-border/40 shadow-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="py-5 px-6 font-bold w-[35%]">Job Post Title</TableHead>
                    <TableHead className="font-bold">Client</TableHead>
                    <TableHead className="font-bold">Budget</TableHead>
                    <TableHead className="font-bold">Tier / Type</TableHead>
                    <TableHead className="font-bold">Bids</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="py-5 px-6 font-bold">Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow 
                      key={job.id} 
                      className="group border-border/40 hover:bg-primary/[0.01] transition-smooth"
                    >
                      {/* Title & Category Column */}
                      <TableCell className="py-4 px-6">
                        <div className="space-y-1 max-w-sm">
                          <span className="font-bold block text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Layers size={12} className="text-muted-foreground/60" />
                            <span>{job.category?.name}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Client details info */}
                      <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg overflow-hidden bg-muted border border-border/40 flex items-center justify-center shrink-0">
                            {job.client?.profilePic ? (
                              <img 
                                src={job.client.profilePic} 
                                alt={job.client.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User size={14} className="text-muted-foreground" />
                            )}
                          </div>
                          <span className="truncate text-sm font-semibold">{job.client?.name || "N/A"}</span>
                        </div>
                      </TableCell>

                      {/* Financial Budget Column */}
                      <TableCell className="font-bold text-foreground">
                        <div className="flex items-center gap-0.5 text-sm">
                          <span>{formatBudget(job.budget, job.currency)}</span>
                        </div>
                      </TableCell>

                      {/* Tier Experience Info */}
                      <TableCell className="text-muted-foreground font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-foreground">{job.level}</span>
                          <span className="text-[11px] text-muted-foreground/80">{job.jobType} • {job.employment}</span>
                        </div>
                      </TableCell>

                      {/* Proposal Metric Stats */}
                      <TableCell className="text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Users size={14} className="text-muted-foreground/60" />
                          <span>{job.bidCount}</span>
                        </div>
                      </TableCell>

                      {/* Active Status Badge */}
                      <TableCell>
                        <Badge 
                          variant={job.status === "open" ? "default" : "secondary"}
                          className="capitalize px-2.5 py-0.5 font-semibold text-xs rounded-full"
                        >
                          {job.status}
                        </Badge>
                      </TableCell>

                      {/* Timestamp Date field */}
                      <TableCell className="py-4 px-6 text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Calendar size={14} className="text-primary/70" />
                          {formatDate(job.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </div>
        ) : (
          /* Custom fallback empty directory container state */
          <div className="glass rounded-[2rem] py-16 text-center border border-border/40 shadow-soft">
            <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {searchInput
                ? `No active job postings matches "${searchInput}". Try another query.`
                : "The current job listings directory is completely empty."}
            </p>
          </div>
        )}

        {/* Global Pagination Section */}
        <WithPagination
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AdminJobs;
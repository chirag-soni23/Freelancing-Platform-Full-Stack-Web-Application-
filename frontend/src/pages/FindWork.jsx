import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Clock,
  Briefcase,
  Bookmark,
  CheckCircle2,
  MapPin,
  CircleDollarSign,
  ArrowUpRight,
  Gavel,
  TrendingUp,
  IndianRupee,
  DollarSign,
  Layers3,
  BriefcaseBusiness,
  MonitorSmartphone,
  X,
} from "lucide-react";
import Header from "@/components/work/Header";
import { useJob } from "@/hooks/useJob";
import { useNavigate } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import WithPagination from "@/hoc/WithPagination";

const FindWork = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [employment, setEmployment] = useState("");
  const [jobType, setJobType] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { jobs, pagination } = useJob(null, {
    page,
    limit: 10,
    search: debouncedSearch,
    level,
    employment,
    jobType,
  });

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617] text-foreground p-4 md:p-10">
      <Header />

      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 p-2 bg-white dark:bg-card/50 border border-border/50 rounded-[1.5rem] shadow-xl shadow-black/5">
          <div className="relative flex-[3] flex items-center">
            <Search
              className="absolute left-5 text-muted-foreground"
              size={20}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill (e.g. React, UI/UX Designer, SEO)..."
              className="pl-14 pr-12 !bg-transparent border-none text-md focus-visible:ring-0 h-14"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-4 text-muted-foreground hover:text-red-500 text-lg font-bold"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Button className="h-14 px-10 rounded-xl font-black text-base shadow-lg shadow-primary/20">
            Find Work
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter size={16} className="text-primary" /> Filter Results
              </h2>
            </div>

            <Card className="border-none bg-secondary/30 dark:bg-secondary/10 shadow-none rounded-3xl">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-5">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Level
                  </label>

                  <div className="grid gap-4">
                    {["Entry", "Intermediate", "Expert"].map((lvl) => (
                      <div
                        key={lvl}
                        className="flex items-center space-x-3 group"
                      >
                        <Checkbox
                          checked={level === lvl}
                          onCheckedChange={() =>
                            setLevel(level === lvl ? "" : lvl)
                          }
                          id={lvl}
                          className="w-5 h-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary"
                        />

                        <label
                          htmlFor={lvl}
                          className="text-[15px] font-semibold leading-none cursor-pointer group-hover:text-primary transition-colors"
                        >
                          {lvl} Level
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="bg-border/50" />

                <div className="space-y-5">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Employment
                  </label>

                  <div className="grid gap-4">
                    {["Contract", "Full-time", "Part-time"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center space-x-3 group"
                      >
                        <Checkbox
                          checked={employment === type}
                          onCheckedChange={() =>
                            setEmployment(employment === type ? "" : type)
                          }
                          id={type}
                          className="w-5 h-5 rounded-md border-muted-foreground/30"
                        />

                        <label
                          htmlFor={type}
                          className="text-[15px] font-semibold leading-none cursor-pointer group-hover:text-primary transition-colors"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-5">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Job Type
                  </label>

                  <div className="grid gap-4">
                    {["Remote", "On-site", "Hybrid"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center space-x-3 group"
                      >
                        <Checkbox
                          checked={jobType === type}
                          onCheckedChange={() =>
                            setJobType(jobType === type ? "" : type)
                          }
                          id={type}
                          className="w-5 h-5 rounded-md border-muted-foreground/30"
                        />

                        <label
                          htmlFor={type}
                          className="text-[15px] font-semibold leading-none cursor-pointer group-hover:text-primary transition-colors"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setLevel("");
                      setEmployment("");
                      setJobType("");
                      setSearch("");
                      setPage(1);
                    }}
                    variant="outline"
                    className="w-full rounded-xl border-dashed border-2 font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <Card
                key={i}
                className="border-none bg-white dark:bg-[#0f172a] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-[2rem] overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="p-8 md:p-10">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-wider px-3 py-1">
                            Verified Client
                          </Badge>

                          <span className="text-[13px] text-muted-foreground font-bold flex items-center gap-1.5">
                            <Clock size={14} /> Posted 2h ago
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-primary transition-all duration-300">
                          {job?.title}
                        </h2>

                        <p className="text-muted-foreground text-[16px] leading-relaxed max-w-2xl line-clamp-2">
                          {job?.description}
                        </p>

                        {/* Level / Employment / JobType */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {/* Level */}
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                            <Layers3 className="w-4 h-4 text-primary" />

                            <div className="flex flex-col leading-none">
                              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                                Level
                              </span>

                              <span className="text-xs font-bold text-foreground">
                                {job.level}
                              </span>
                            </div>
                          </div>

                          {/* Employment */}
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <BriefcaseBusiness className="w-4 h-4 text-blue-500" />

                            <div className="flex flex-col leading-none">
                              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                                Employment
                              </span>

                              <span className="text-xs font-bold text-foreground">
                                {job.employment}
                              </span>
                            </div>
                          </div>

                          {/* Job Type */}
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <MonitorSmartphone className="w-4 h-4 text-emerald-500" />

                            <div className="flex flex-col leading-none">
                              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                                Job Type
                              </span>

                              <span className="text-xs font-bold text-foreground">
                                {job.jobType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {job?.skills.map((s) => (
                            <span
                              key={s}
                              className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[12px] font-bold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-destructive hover:text-white transition-colors border-border/50"
                      >
                        <Bookmark size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-secondary/20 dark:bg-secondary/10 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/10">
                    <div className="flex items-center gap-10">
                      {/* Budget */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em]">
                          Budget
                        </p>

                        <div className="flex items-center gap-1.5 font-black text-xl tracking-tight">
                          {job?.currency === "INR" ? (
                            <IndianRupee
                              size={20}
                              className="text-emerald-500"
                            />
                          ) : (
                            <DollarSign
                              size={20}
                              className="text-emerald-500"
                            />
                          )}

                          <span>{job?.budget}</span>
                        </div>
                      </div>

                      <Separator
                        orientation="vertical"
                        className="h-10 bg-border/60 hidden md:block"
                      />

                      {/* Bid Status */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em]">
                          Bid Status
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Gavel size={18} className="text-blue-500" />

                            <span className="font-bold text-lg leading-none">
                              18 Bids
                            </span>
                          </div>

                          <Badge
                            variant="outline"
                            className="bg-blue-500/5 text-blue-600 border-blue-200 dark:border-blue-900 text-[10px] font-bold py-0 h-5"
                          >
                            Avg. ₹42k
                          </Badge>
                        </div>
                      </div>

                      {/* Competition */}
                      <div className="hidden xl:flex flex-col space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em]">
                          Competition
                        </p>

                        <div className="flex items-center gap-1.5 text-orange-500">
                          <TrendingUp size={16} />

                          <span className="text-sm font-bold italic">High</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-3">
                      <Button
                        onClick={() => navigate(`/job-details/${job.id}`)}
                        className="w-full md:w-auto rounded-2xl px-10 h-12 font-black group/btn shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
                      >
                        View Details
                        <ArrowUpRight
                          className="ml-2 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                          size={18}
                        />
                      </Button>

                      <Button className="w-full md:w-auto rounded-2xl px-10 h-12 font-black group/btn shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                        Place a Bid
                        <ArrowUpRight
                          className="ml-2 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                          size={18}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-none bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <CardContent className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-3xl font-black tracking-tight mb-3">
                  No Jobs Found
                </h2>

                <p className="text-muted-foreground max-w-md leading-relaxed mb-8">
                  We couldn't find any jobs matching your current filters or
                  search keywords.
                </p>

                <Button
                  onClick={() => {
                    setLevel("");
                    setEmployment("");
                    setJobType("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="rounded-2xl px-8 h-12 font-black"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {jobs.length > 0 && (
            <WithPagination
              page={page}
              totalPages={pagination?.totalPages}
              onPageChange={setPage}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default FindWork;

import React from "react";
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
} from "lucide-react";
import Header from "@/components/work/Header";
import { useJob } from "@/hooks/useJob";
import { useNavigate } from "react-router-dom";

// const jobs = [1, 2, 3, 4];

const FindWork = () => {
  const { jobs } = useJob();
  // console.log(jobs);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617] text-foreground p-4 md:p-10">
      <Header />

      <div className="max-w-7xl mx-auto mb-16">
        <div className="group flex flex-col md:flex-row gap-4 p-3 bg-white/80 dark:bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="relative flex-[2.5] flex items-center">
            <Search className="absolute left-5 text-primary" size={20} />
            <Input
              placeholder="Search roles, tech stack, or companies..."
              className="pl-14 !bg-transparent border-none text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 h-14"
            />
          </div>
          <Separator
            orientation="vertical"
            className="hidden md:block h-10 self-center bg-border/60"
          />
          <div className="relative flex-1 flex items-center">
            <MapPin
              className="absolute left-5 text-muted-foreground"
              size={20}
            />
            <Input
              placeholder="Remote / City"
              className="pl-14 !bg-transparent border-none text-lg focus-visible:ring-0 h-14"
            />
          </div>
          <Button className="h-14 px-10 rounded-[1.5rem] font-black text-base transition-all">
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
                          id={lvl}
                          className="w-5 h-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary"
                        />
                        <label
                          htmlFor={lvl}
                          className="text-[15px] font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-primary transition-colors"
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
          {jobs.map((job, i) => (
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
                        {/* <span className="text-muted-foreground/40 font-light">
                          / Next.js
                        </span> */}
                      </h2>

                      <p className="text-muted-foreground text-[16px] leading-relaxed max-w-2xl line-clamp-2">
                        {job?.description}
                      </p>

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

                <div className="bg-secondary/20 dark:bg-secondary/10 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/10">
                  <div className="flex items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.15em]">
                        Budget
                      </p>
                      <div className="flex items-center gap-1.5 font-black text-xl tracking-tight">
                        {job?.currency === "INR" ? (
                          <IndianRupee size={20} className="text-emerald-500" />
                        ) : (
                          <DollarSign size={20} className="text-emerald-500" />
                        )}

                        <span>{job?.budget}</span>
                      </div>
                    </div>

                    <Separator
                      orientation="vertical"
                      className="h-10 bg-border/60 hidden md:block"
                    />

                    {/* Bid Activity Section */}
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
                  <div className="flex flex-col md:flex-row gap-3">
                    <Button onClick={() => navigate(`/job-details/${job.id}`)} className="w-full md:w-auto rounded-2xl px-10 h-12 font-black group/btn shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
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
          ))}
        </main>
      </div>
    </div>
  );
};

export default FindWork;

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJob } from "@/hooks/useJob";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  ArrowLeft,
  IndianRupee,
  DollarSign,
  ExternalLink,
  Gavel,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Building2,
  MessageSquare,
  Bookmark,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, isLoadingJob } = useJob(id);

  if (isLoadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-muted-foreground animate-pulse tracking-tight">
            Fetching Job Intel...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-black mb-4 tracking-tighter">
          Job not found!
        </h2>
        <Button onClick={() => navigate("/jobs")} className="rounded-full px-8">
          Return to Marketplace
        </Button>
      </div>
    );
  }

  const j = job.data;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] text-foreground font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="group font-bold gap-2 rounded-full hover:bg-secondary"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Jobs
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hidden sm:flex"
            >
              <Share2 size={18} />
            </Button>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full font-bold">
              <CheckCircle2 size={14} className="mr-1.5" />{" "}
              {j.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: Main Content --- */}
          <div className="lg:col-span-8 space-y-10">
            <header className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground font-bold text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded">
                    <Clock size={14} /> Posted{" "}
                    {new Date(j.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded">
                    <Gavel size={14} /> {j.bidCount} Bids Active
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                  {j.title}
                </h1>
              </div>

              <div className="flex flex-wrap gap-2">
                {j.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-4 py-2 rounded-xl text-sm font-bold border-none shadow-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </header>

            <Separator className="opacity-50" />

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight">
                  Project Details
                </h3>
                <Badge
                  variant="outline"
                  className="rounded-full font-bold border-2"
                >
                  Full-Time
                </Badge>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line font-medium bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-border/50">
                {j.description}
              </div>
            </section>

            {/* Mobile View Client Card */}
            <section className="lg:hidden">
              <ClientInfoCard client={j.client} />
            </section>
          </div>

          {/* --- RIGHT: Sidebar Action Panel --- */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="border-none bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none sticky top-28 overflow-hidden">
              <CardContent className="p-8 space-y-8">
                {/* Budget Stat */}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                    Project Budget
                  </p>
                  <div className="flex items-baseline gap-1 text-primary">
                    <span className="text-5xl font-black tracking-tighter flex items-center">
                      {j.currency === "INR" ? (
                        <IndianRupee size={36} strokeWidth={3} />
                      ) : (
                        <DollarSign size={36} strokeWidth={3} />
                      )}
                      {j.budget.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold opacity-60">
                      / total
                    </span>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/50 space-y-1">
                    <p className="text-[10px] font-black uppercase opacity-50 tracking-tighter">
                      Competition
                    </p>
                    <p className="font-bold flex items-center gap-1 text-orange-500">
                      <TrendingUp size={16} /> {j.competition.toUpperCase()}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/50 space-y-1">
                    <p className="text-[10px] font-black uppercase opacity-50 tracking-tighter">
                      Avg. Bid
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {j.currency === "INR" ? "₹" : "$"}
                      {j.avgBid || "0"}
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-3 pt-4">
                  <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95">
                    Submit a Proposal
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl font-bold border-2 hover:bg-secondary flex items-center justify-center gap-2 transition-all active:scale-95"
                    onClick={() =>
                      console.log("Chat initiated with:", j.client.id)
                    }
                  >
                    <MessageSquare size={20} className="text-primary" />
                    Start a Chat
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="flex-1 h-12 rounded-xl font-bold text-muted-foreground gap-2"
                    >
                      <Bookmark size={18} /> Save
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 h-12 rounded-xl font-bold text-muted-foreground gap-2"
                    >
                      <Share2 size={18} /> Share
                    </Button>
                  </div>
                </div>

                <Separator className="opacity-50" />

                {/* Client Profile Section */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground">
                      About Client
                    </h4>
                    <Badge className="bg-blue-500/10 text-blue-500 border-none font-bold text-[10px]">
                      VERIFIED
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 p-0.5">
                      <AvatarImage
                        src={j.client.profilePic}
                        className="rounded-full object-cover"
                      />
                      <AvatarFallback className="font-black bg-primary/10 text-primary">
                        {j.client.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black flex items-center gap-1 text-lg leading-tight">
                        {j.client.name}
                        {j.client.isEmailVerified && (
                          <ShieldCheck
                            size={16}
                            className="text-blue-500 fill-blue-500/10"
                          />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                        <MapPin size={10} /> {j.client.address}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-secondary/30 p-4 rounded-2xl">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <Building2
                        size={16}
                        className="text-primary opacity-70"
                      />
                      <span className="opacity-80">
                        {j.client.companyName || "Individual Client"}
                      </span>
                    </div>
                    {j.client.companyWebsite && (
                      <a
                        href={j.client.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-xs font-bold text-primary hover:underline"
                      >
                        <ExternalLink size={16} /> Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Mobile View
const ClientInfoCard = ({ client }) => (
  <Card className="rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-lg">
    <CardContent className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border-4 border-slate-50 dark:border-slate-800 shadow-sm">
          <AvatarImage src={client.profilePic} />
          <AvatarFallback>{client.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-black text-lg">{client.name}</h4>
          <p className="text-xs font-bold text-muted-foreground">
            {client.address}
          </p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full h-12 w-12"
      >
        <MessageSquare size={20} className="text-primary" />
      </Button>
    </CardContent>
  </Card>
);

export default JobDetails;

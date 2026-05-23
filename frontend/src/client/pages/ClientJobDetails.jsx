import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  BriefcaseBusiness,
  Layers3,
  MonitorSmartphone,
  IndianRupee,
  DollarSign,
  ChevronRight,
  Gavel,
  ShieldCheck,
  Building2,
  ExternalLink,
  MapPin,
  MessageSquare,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useJob } from "@/hooks/useJob";
import ClientBid from "./ClientBid";

const ClientJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Apne custom hook se job data fetch karein
  const { job, isLoadingJob } = useJob(id);

  if (isLoadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-tight">
            Fetching Project details...
          </p>
        </div>
      </div>
    );
  }

  if (!job || !job.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <h2 className="text-3xl font-black mb-4 tracking-tighter">
          Job not found
        </h2>
        <Button
          onClick={() => navigate(-1)}
          className="rounded-xl px-6 font-bold"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const j = job.data;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen text-foreground p-4 md:p-8 transition-theme">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="group font-bold gap-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Listings
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-border/40 h-10 w-10"
          >
            <Share2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-border/40 h-10 w-10"
          >
            <Bookmark size={16} />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- LEFT COLUMN: Main Job Spec Info --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-6">
            {/* Status & Time Meta tags */}
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                  j.status?.toLowerCase() === "open"
                    ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                    : "bg-red-500/5 text-red-500 border-red-500/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${j.status?.toLowerCase() === "open" ? "bg-emerald-500" : "bg-red-400"}`}
                />
                {j.status || "Open"}
              </div>
              <div className="h-4 w-[1px] bg-border/60" />
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Clock size={14} className="opacity-70" />
                Posted on {formatDate(j.createdAt)}
              </span>
            </div>

            {/* Premium Header text styling */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {j.title}
            </h1>
          </div>

          {/* Metric Badges Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <BriefcaseBusiness className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mb-1">
                  Category
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {j.category?.name || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
              <Layers3 className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mb-1">
                  Level
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {j.level || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <BriefcaseBusiness className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mb-1">
                  Employment
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {j.employment || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <MonitorSmartphone className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground mb-1">
                  Job Type
                </span>
                <span className="text-xs font-bold text-foreground truncate">
                  {j.jobType || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Job Description Card Wrapper */}
          <Card className="border-none bg-background/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[24px] overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Project Overview
              </h3>
              <p className="text-muted-foreground/90 leading-relaxed text-base whitespace-pre-line">
                {j.description}
              </p>
            </CardContent>
          </Card>

          {/* Core Skills section matching list items */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Required Expertise
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {j.skills?.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-secondary/60 text-secondary-foreground text-xs font-semibold border border-transparent hover:border-primary/20 hover:bg-background transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Premium Commercial Actions Panel --- */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <Card className="border-none bg-background/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-[24px] overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Valuation Panel */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  Project Valuation
                </p>
                <div className="text-4xl font-black tracking-tighter text-foreground flex items-baseline">
                  <span className="text-primary mr-1 font-bold">
                    {j.currency?.toUpperCase() === "INR" ? "₹" : "$"}
                  </span>
                  {j.budget?.toLocaleString()}
                  <span className="text-xs font-bold text-muted-foreground/60 tracking-normal ml-2">
                    Est. Budget
                  </span>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Proposal & Views Stats Grid */}
              <div className="grid grid-cols-2 gap-4 py-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Gavel size={12} className="text-primary" /> Active Bids
                  </p>
                  <p className="text-lg font-extrabold text-foreground">
                    {j.bidCount || 0} Freelancers
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <MonitorSmartphone size={12} className="text-primary" />{" "}
                    Setup Mode
                  </p>
                  <p className="text-lg font-extrabold text-foreground capitalize">
                    {j.jobType || "Remote"}
                  </p>
                </div>
              </div>

              {/* CTA Primary Action buttons */}
              {/* <div className="space-y-3 pt-2">
                <Button className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_10px_20px_rgba(var(--primary),0.15)] transition-all active:scale-95 group gap-2">
                  Submit Proposal
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary transition-all active:scale-95 text-foreground flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} className="text-primary" />
                  Contact Poster
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Client profile summary panel layout */}
          {j.client && (
            <Card className="border-none bg-secondary/10 rounded-[24px] overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                    About the Client
                  </h4>
                  {j.client.isEmailVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/5 text-blue-500 hover:bg-blue-500/5 border border-blue-500/10 font-bold text-[9px] rounded-md px-2 py-0.5"
                    >
                      VERIFIED
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-xl border border-border/50">
                    <AvatarImage
                      src={j.client.profilePic}
                      alt={j.client.name}
                    />
                    <AvatarFallback className="font-bold bg-background text-xs">
                      {j.client.name
                        ? j.client.name.substring(0, 2).toUpperCase()
                        : "CL"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-extrabold text-foreground flex items-center gap-1 text-sm truncate">
                      {j.client.name}
                      {j.client.isEmailVerified && (
                        <ShieldCheck
                          size={14}
                          className="text-blue-500 fill-blue-500/10 shrink-0"
                        />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1 truncate">
                      <MapPin size={12} className="opacity-60" />{" "}
                      {j.client.address || "Location unavailable"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <Building2 size={14} className="text-primary opacity-80" />
                    <span className="truncate">
                      {j.client.companyName || "Independent Operator"}
                    </span>
                  </div>
                  {j.client.companyWebsite && (
                    <a
                      href={j.client.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline transition-all"
                    >
                      <ExternalLink size={14} /> Visit company asset
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ClientBid jobId={id} />
    </div>
  );
};

export default ClientJobDetails;

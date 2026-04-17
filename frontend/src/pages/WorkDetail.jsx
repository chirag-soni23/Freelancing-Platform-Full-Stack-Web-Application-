import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Briefcase,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  Share2,
  Bookmark,
  DollarSign,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const WorkDetail = () => {
  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617] text-foreground p-4 md:p-10 lg:p-16">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <Link to={"/find-work"}>
          {" "}
          <Button
            variant="ghost"
            className="gap-2 font-bold hover:bg-transparent hover:text-primary p-0"
          >
            <ChevronLeft size={18} /> Back to Search
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/50"
          >
            <Share2 size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/50"
          >
            <Bookmark size={18} />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 📝 Left Side: Project Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                Active Project
              </Badge>
              <span className="text-sm text-muted-foreground font-bold flex items-center gap-1.5">
                <Clock size={16} /> Posted 45 minutes ago
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              Next-Gen Fintech Dashboard{" "}
              <span className="text-primary italic">Development</span>
            </h1>

            <div className="flex flex-wrap gap-6 py-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <Briefcase size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Experience
                  </p>
                  <p className="font-bold text-sm">Expert / Senior</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Duration
                  </p>
                  <p className="font-bold text-sm">3-6 Months</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Project Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">
              Project Description
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We are looking for a Senior Full-Stack Developer to lead the
              development of our core financial analytics dashboard. The ideal
              candidate should have extensive experience with{" "}
              <strong>Next.js 14, TypeScript, and Shadcn UI</strong>. You will
              be responsible for building complex data visualizations and
              ensuring high-performance real-time updates.
            </p>
            <ul className="grid gap-3 pt-2">
              {[
                "Build 20+ responsive dashboard components",
                "Integrate Supabase Auth & Realtime DB",
                "Implement Framer Motion for premium feel",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm font-semibold"
                >
                  <CheckCircle2 size={18} className="text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Required */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "Next.js",
                "Tailwind CSS",
                "PostgreSQL",
                "Framer Motion",
                "Three.js",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-5 py-2 rounded-2xl bg-secondary text-secondary-foreground text-xs font-black border border-border/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 💰 Right Side: Bidding Widget (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <Card className="border-none bg-white dark:bg-[#0f172a] shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Fixed Budget
                  </p>
                  <h2 className="text-4xl font-black tracking-tighter italic">
                    ₹65,000 - ₹90,000
                  </h2>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest ml-1">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        placeholder="Enter amount"
                        className="pl-12 h-14 rounded-2xl bg-secondary/30 border-none font-bold text-lg focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest ml-1">
                      Proposal / Cover Letter
                    </label>
                    <Textarea
                      placeholder="Explain why you are the best fit..."
                      className="min-h-[150px] rounded-2xl bg-secondary/30 border-none p-5 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>

                  <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 group">
                    Submit Proposal
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </Button>
                </div>

                <p className="text-[10px] text-center text-muted-foreground font-bold">
                  Estimated Service Fee: ₹1,500
                </p>
              </CardContent>
            </Card>

            {/* Client Info Card */}
            <Card className="border-none bg-primary/5 rounded-[2rem]">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck size={16} /> About Client
                </h4>
                <div className="space-y-2">
                  <p className="font-black text-sm">Swaastik Solutions</p>
                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap size={14} className="text-orange-500" /> 98% Hire
                      Rate
                    </span>
                    <span className="flex items-center gap-1">
                      📍 Jodhpur, India
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;

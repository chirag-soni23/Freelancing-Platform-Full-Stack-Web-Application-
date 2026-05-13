import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  IndianRupee,
  DollarSign,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Star,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useChat } from "@/hooks/useChat";

const FreelancerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startChat } = useChat();
  const { freelancer, isLoadingFreelancer } = useAuth(null, id);
  // console.log(freelancer);

  if (isLoadingFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-muted-foreground animate-pulse">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black mb-4 text-slate-800">
          Freelancer not found!
        </h2>
        <Button
          onClick={() => navigate("/freelancers")}
          variant="default"
          className="rounded-full"
        >
          Return to Search
        </Button>
      </div>
    );
  }

  const f = freelancer;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] text-foreground transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="group font-bold gap-2 hover:bg-primary/5 rounded-full px-4"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Listings
          </Button>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="rounded-full font-bold">
              Save Profile
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Profile & Bio */}
          <div className="lg:col-span-8 space-y-8">
            {/* Essential Profile Section */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative shrink-0">
                <Avatar className="h-40 w-40 border-[6px] border-white dark:border-slate-900 shadow-2xl">
                  <AvatarImage
                    src={f?.profilePic}
                    alt={f?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
                    {f?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {f?.isEmailVerified && (
                  <div
                    className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full border-4 border-white dark:border-slate-900 shadow-lg"
                    title="Verified Professional"
                  >
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      {f?.name}
                    </h1>
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none font-bold px-3 py-1 rounded-lg">
                      <CheckCircle2 size={14} className="mr-1" /> Available Now
                    </Badge>
                  </div>
                  <p className="text-primary text-2xl font-bold tracking-tight opacity-90">
                    {f?.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-5 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                    <MapPin size={16} className="text-primary" /> {f?.address}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                    <Star size={16} className="text-amber-500 fill-amber-500" />{" "}
                    4.9 (Top Rated)
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                    <Globe size={16} className="text-blue-500" />
                    {f?.languages?.length > 0
                      ? f.languages.join(", ")
                      : "No Languages"}
                  </span>
                </div>
              </div>
            </section>

            <Separator className="bg-border/60" />

            {/* Bio Section */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">
                Professional Summary
              </h3>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-3xl font-medium">
                {f?.bio || "No biography provided yet."}
              </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">
                Technical Arsenal
              </h3>
              <div className="flex flex-wrap gap-3">
                {f?.skills?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-sm font-bold border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Action Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="border-none bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden sticky top-28">
              <CardContent className="p-8 space-y-8">
                {/* Rate Card */}
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-black uppercase tracking-widest">
                    Service Rate
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter flex items-center">
                      {f?.currency === "INR" ? (
                        <IndianRupee size={32} className="mr-1" />
                      ) : (
                        <DollarSign size={32} className="mr-1" />
                      )}
                      {f?.hourlyRate}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground">
                      / hr
                    </span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90 h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                    Hire {f?.name.split(" ")[0]} Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl font-bold border-2 hover:bg-secondary/50"
                    onClick={async () => {
                      try {
                        const res = await startChat({
                          receiverId: f?.id,
                        });

                        navigate(
                          `/dashboard/chats?conversationId=${res?.data?.id}&receiverId=${f?.id}`,
                        );
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <MessageSquare size={20} className="mr-2" />
                    Start a Chat
                  </Button>
                </div>

                <Separator />

                {/* Meta Details */}
                <div className="space-y-5">
                  <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Verified Contacts
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Mail size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black uppercase opacity-50 tracking-wider">
                          Email Address
                        </p>
                        <p className="font-bold text-sm truncate">{f?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-50 tracking-wider">
                          Direct Line
                        </p>
                        <p className="font-bold text-sm">
                          {f?.phone || "Private"}
                        </p>
                      </div>
                    </div>

                    {f?.portfolio && (
                      <a
                        href={f?.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 group"
                      >
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <ExternalLink size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-50 tracking-wider">
                            Portfolio
                          </p>
                          <p className="font-bold text-sm text-primary flex items-center gap-1 group-hover:underline">
                            view-portfolio.web <ExternalLink size={12} />
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="pt-4 flex items-center justify-center gap-2 text-muted-foreground font-bold text-xs bg-slate-50 dark:bg-slate-800/50 py-3 rounded-2xl">
                  <Calendar size={14} /> Member since{" "}
                  {new Date(f?.createdAt).getFullYear()}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FreelancerDetails;

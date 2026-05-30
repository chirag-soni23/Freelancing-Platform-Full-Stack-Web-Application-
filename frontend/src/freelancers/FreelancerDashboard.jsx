import React from "react";
import {
  Users,
  BriefcaseBusiness,
  FolderKanban,
  UserRound,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

const FreelancerDashboard = () => {
  const {
    totalJobs,
    totalReviews,
    totalBids,
    acceptedBids,
    rejectedBids,
    pendingBids,
    isLoading,
  } = useDashboard("freelancer");

  const cards = [
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
      gradient: "from-orange-500/10 to-amber-500/5",
      border: "group-hover:border-orange-500/30",
      iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: Users,
      gradient: "from-blue-500/10 to-cyan-500/5",
      border: "group-hover:border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Bids",
      value: totalBids,
      icon: FolderKanban,
      gradient: "from-violet-500/10 to-purple-500/5",
      border: "group-hover:border-violet-500/30",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Accepted Bids",
      value: acceptedBids,
      icon: CheckCircle,
      gradient: "from-green-500/10 to-emerald-500/5",
      border: "group-hover:border-green-500/30",
      iconBg: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Rejected Bids",
      value: rejectedBids,
      icon: UserRound,
      gradient: "from-red-500/10 to-rose-500/5",
      border: "group-hover:border-red-500/30",
      iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      title: "Pending Bids",
      value: pendingBids,
      icon: Clock,
      gradient: "from-yellow-500/10 to-amber-500/5",
      border: "group-hover:border-yellow-500/30",
      iconBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-8xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Freelancer Dashboard
        </h1>

        <p className="text-sm md:text-base text-muted-foreground font-medium">
          Real-time overview of your platform metrics and statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(
          ({ title, value, icon: Icon, gradient, border, iconBg }, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-gradient-to-br ${gradient} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out`}
            >
              <div
                className={`absolute inset-0 border-b-2 border-transparent transition-all duration-300 ${border}`}
              />

              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    {title}
                  </p>

                  {isLoading ? (
                    <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ) : (
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                      {value?.toLocaleString() || 0}
                    </h2>
                  )}
                </div>

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${iconBg}`}
                >
                  <Icon size={26} strokeWidth={2.2} />
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;

import React from "react";
import {
  Users,
  BriefcaseBusiness,
  FolderKanban,
  UserRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

const AdminDashboard = () => {
  const {
    totalFreelancers,
    totalClients,
    totalCategories,
    totalJobs,
    isLoading,
  } = useDashboard("admin");

  const cards = [
    {
      title: "Total Freelancers",
      value: totalFreelancers,
      icon: Users,
      gradient: "from-blue-500/10 to-cyan-500/5",
      border: "group-hover:border-blue-500/30",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Clients",
      value: totalClients,
      icon: UserRound,
      gradient: "from-emerald-500/10 to-teal-500/5",
      // border: "group-hover:border-emerald-500/30",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      icon: FolderKanban,
      gradient: "from-purple-500/10 to-pink-500/5",
      // border: "group-hover:border-purple-500/30",
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
      gradient: "from-orange-500/10 to-amber-500/5",
      // border: "group-hover:border-orange-500/30",
      iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-8xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-medium">
          Real-time overview of your platform metrics and statistics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(
          (
            { title, value, icon: Icon, gradient, border, iconBg },
            index
          ) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-gradient-to-br ${gradient} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out`}
            >
              {/* Subtle Border Glow on Hover */}
              <div className={`absolute inset-0 border-b-2 border-transparent transition-all duration-300 ${border}`} />
              
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    {title}
                  </p>

                  {isLoading ? (
                    /* Beautiful Skeleton Loading Animation */
                    <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ) : (
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                      {value?.toLocaleString() || 0}
                    </h2>
                  )}
                </div>

                {/* Animated Icon Container */}
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${iconBg}`}
                >
                  <Icon size={26} strokeWidth={2.2} />
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Inbox
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import WithPagination from "@/hoc/WithPagination";

const Review = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const role = user?.data?.role;

  const { stats, reviews, isLoading, pagination } = useDashboard(role, {
    page,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground font-semibold tracking-wide animate-pulse">
            Loading your reviews...
          </p>
        </div>
      </div>
    );
  }

  const ratingDistribution = [
    { stars: 5, percentage: stats?.ratingPercentages?.["5"] || 0, color: "bg-emerald-500" },
    { stars: 4, percentage: stats?.ratingPercentages?.["4"] || 0, color: "bg-cyan-500" },
    { stars: 3, percentage: stats?.ratingPercentages?.["3"] || 0, color: "bg-amber-500" },
    { stars: 2, percentage: stats?.ratingPercentages?.["2"] || 0, color: "bg-orange-500" },
    { stars: 1, percentage: stats?.ratingPercentages?.["1"] || 0, color: "bg-rose-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-foreground transition-theme antialiased">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
            Ratings <span className="text-primary/80">&</span> Reviews
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor product feedback and customer satisfaction metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-primary/20">
          <ShieldCheck className="w-4 h-4" /> Panel: {role || "User"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 card-elevated p-6 sm:p-8 bg-card border-border backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 tracking-tight">
            <TrendingUp className="w-5 h-5 text-primary" />
            Overall Performance
          </h2>

          <div className="flex flex-col md:flex-row items-stretch gap-8">
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-900/20 border border-border rounded-2xl p-6 flex flex-col items-center justify-center min-w-[180px] shadow-inner">
              <span className="text-7xl font-black tracking-tighter text-foreground mb-1">
                {stats?.averageRating || 0}
              </span>

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= Math.round(stats?.averageRating || 0)
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs tracking-wider uppercase text-muted-foreground font-black bg-background px-3 py-1 rounded-full border border-border shadow-sm">
                {stats?.totalReviews || 0} Reviews
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3.5">
              {ratingDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-4 text-xs font-bold group">
                  <span className="w-12 text-muted-foreground transition-colors group-hover:text-foreground whitespace-nowrap">
                    {row.stars} Star
                  </span>

                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[1px]">
                    <div
                      className={`h-full ${row.color} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-muted-foreground group-hover:text-foreground tabular-nums">
                    {row.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 card-elevated p-6 sm:p-8 bg-card border-border flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 tracking-tight">
              <User className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
              {reviews?.length > 0 ? (
                reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="border border-border/60 hover:border-primary/30 rounded-xl p-3.5 flex items-center justify-between bg-background/40 hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {review?.sender?.profilePic ? (
                        <img
                          src={review.sender.profilePic}
                          alt={review.sender.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-background shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/10 to-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase border border-primary/10">
                          {review?.sender?.name?.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-bold text-sm tracking-tight truncate text-foreground/90">
                          {review?.sender?.name}
                        </p>
                        <p className="text-[10px] tracking-wider font-black text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {review?.sender?.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black px-2 py-1 rounded-lg text-xs border border-amber-500/20 shadow-sm shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      {review.rating}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                  No recent activity
                </div>
              )}
            </div>
          </div>
          
          <div className="text-[11px] font-bold text-center text-muted-foreground/70 bg-muted/30 py-2 rounded-lg mt-4 border border-border/50">
            Showing top entries
          </div>
        </div>
      </div>

      <div className="card-elevated bg-card border-border overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 tracking-tight">
            <MessageSquare className="w-5 h-5 text-primary" />
            Detailed Logs
          </h2>
          <span className="text-xs font-bold text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border">
            Total Logs: {reviews?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground bg-muted/20">
                <th className="p-4 pl-6">Reviewer</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Rating Score</th>
                <th className="p-4 max-w-xs">Feedback/Comment</th>
                <th className="p-4 pr-6 text-right">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/50 text-sm font-medium">
              {reviews?.length > 0 ? (
                reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-primary/[0.01] dark:hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {review?.sender?.profilePic ? (
                          <img
                            src={review.sender.profilePic}
                            alt={review.sender.name}
                            className="w-9 h-9 rounded-full object-cover border border-border shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold uppercase text-xs border border-border">
                            {review?.sender?.name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {review?.sender?.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-muted-foreground font-bold px-2.5 py-1 rounded-md border border-border/50 uppercase tracking-wider">
                        {review?.sender?.role || "N/A"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        {review.rating} / 5
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground max-w-xs truncate font-normal italic text-sm">
                      "{review.comment || "No feedback left by user"}"
                    </td>

                    <td className="p-4 pr-6 text-right text-xs font-bold text-muted-foreground/80 tabular-nums">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-3 bg-muted rounded-2xl border border-border">
                        <Inbox className="w-6 h-6 text-muted-foreground/60" />
                      </div>
                      <p className="text-muted-foreground font-semibold text-sm">
                        No reviews available right now
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <WithPagination
          page={page}
          totalPages={pagination?.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
export default Review;
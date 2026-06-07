import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, IndianRupee } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

// Fully dynamic theme-based Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-2xl shadow-md backdrop-blur-sm">
        <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-card-foreground flex items-center gap-0.5">
          <span>₹</span>
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const FreelancerCharts = () => {
  const { earningsGraph, totalEarnings } = useDashboard("freelancer");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      {/* Monthly Earnings Chart */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-card-foreground tracking-tight">
              Monthly Earnings
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revenue generated per month
            </p>
          </div>

          <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-primary" />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={earningsGraph} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                {/* Fallback to clean royal primary hex code for Recharts gradients rendering safely */}
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="text-border/60"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-muted-foreground font-medium text-[11px]"
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-muted-foreground/80 text-[11px]"
              dx={-5}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
            />

            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              fill="url(#earningsGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings Trend Chart */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-card-foreground tracking-tight">
              Earnings Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Growth performance over time
            </p>
          </div>

          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <h3 className="text-3xl font-black text-card-foreground tracking-tight flex items-baseline gap-0.5">
            <span className="text-xl font-bold text-muted-foreground">₹</span>
            {totalEarnings?.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Total Earnings
          </p>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={earningsGraph} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="text-border/60"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-muted-foreground font-medium text-[11px]"
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-muted-foreground/80 text-[11px]"
              dx={-5}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#10b981', strokeWidth: 1.2 }} 
            />

            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#ffffff',
                stroke: '#10b981',
                strokeWidth: 2.5,
              }}
              activeDot={{
                r: 6,
                fill: '#10b981',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FreelancerCharts;
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
import { Wallet, TrendingDown } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-2xl shadow-md backdrop-blur-sm">
        <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">
          {label}
        </p>

        <p className="text-sm font-bold text-card-foreground flex items-center gap-0.5">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const ClientCharts = () => {
  const { spendingGraph, totalSpent } = useDashboard("client");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      {/* Monthly Spending */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-card-foreground tracking-tight">
              Monthly Spending
            </h2>

            <p className="text-xs text-muted-foreground mt-0.5">
              Money spent on freelancers
            </p>
          </div>

          <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-rose-500" />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={spendingGraph}
            margin={{
              top: 10,
              right: 10,
              left: -25,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />

                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" vertical={false} />

            <XAxis dataKey="month" tickLine={false} axisLine={false} />

            <YAxis tickLine={false} axisLine={false} />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="spent"
              stroke="#ef4444"
              fill="url(#spendingGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Trend */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-card-foreground tracking-tight">
              Spending Trend
            </h2>

            <p className="text-xs text-muted-foreground mt-0.5">
              Client payment activity
            </p>
          </div>

          <div className="h-11 w-11 rounded-2xl bg-orange-500/10 border border-orange-500/10 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-orange-500" />
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <h3 className="text-3xl font-black text-card-foreground tracking-tight flex items-baseline gap-1">
            <span className="text-xl text-muted-foreground">₹</span>

            {totalSpent?.toLocaleString()}
          </h3>

          <p className="text-xs text-orange-500 font-semibold mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Total Spent
          </p>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={spendingGraph}
            margin={{
              top: 10,
              right: 15,
              left: -25,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} />

            <XAxis dataKey="month" tickLine={false} axisLine={false} />

            <YAxis tickLine={false} axisLine={false} />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="spent"
              stroke="#f97316"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#fff",
                stroke: "#f97316",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#f97316",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientCharts;

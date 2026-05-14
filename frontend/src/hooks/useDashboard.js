import { useQuery } from "@tanstack/react-query";

import {
  getClientReviewDashboard,
  getFreelancerReviewDashboard,
  getReviewDashboard,
} from "@/features/dashboardApi";

import { toast } from "@/hooks/use-toast";

export const useDashboard = (role, params) => {
  // freelancer dashboard
  const freelancerDashboardQuery = useQuery({
    queryKey: ["freelancer-review-dashboard", params],

    queryFn: () => getFreelancerReviewDashboard(params),

    enabled: role === "freelancer",

    keepPreviousData: true,

    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to fetch freelancer dashboard",
        variant: "destructive",
      });
    },
  });

  // client dashboard
  const clientDashboardQuery = useQuery({
    queryKey: ["client-review-dashboard", params],

    queryFn: () => getClientReviewDashboard(params),

    enabled: role === "client",

    keepPreviousData: true,

    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to fetch client dashboard",
        variant: "destructive",
      });
    },
  });

  // common dashboard
  const reviewDashboardQuery = useQuery({
    queryKey: ["review-dashboard", params],

    queryFn: () => getReviewDashboard(params),

    enabled: !role,

    keepPreviousData: true,

    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to fetch dashboard",
        variant: "destructive",
      });
    },
  });

  const dashboardData =
    role === "freelancer"
      ? freelancerDashboardQuery.data?.data
      : role === "client"
        ? clientDashboardQuery.data?.data
        : reviewDashboardQuery.data?.data;

  return {
    // dashboard
    dashboard: dashboardData || {},

    // stats
    stats: dashboardData?.stats || {},

    // reviews
    reviews: dashboardData?.reviews || [],

    // pagination
    pagination: dashboardData?.pagination || {},

    // loading
    isLoading:
      freelancerDashboardQuery.isLoading ||
      clientDashboardQuery.isLoading ||
      reviewDashboardQuery.isLoading,
  };
};
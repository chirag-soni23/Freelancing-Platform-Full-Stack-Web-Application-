import { useQuery, keepPreviousData } from "@tanstack/react-query";

import {
  getClientReviewDashboard,
  getFreelancerReviewDashboard,
  getReviewDashboard,
  getAdminFreelancers,
  getAdminClients,
  getAdminCategories,
  getAdminJobs,
} from "@/features/dashboardApi";

export const useDashboard = (role, params = {}) => {
  // freelancer dashboard
  const freelancerDashboardQuery = useQuery({
    queryKey: ["freelancer-review-dashboard", params],
    queryFn: () => getFreelancerReviewDashboard(params),
    enabled: role === "freelancer",
    placeholderData: keepPreviousData,
  });

  // client dashboard
  const clientDashboardQuery = useQuery({
    queryKey: ["client-review-dashboard", params],
    queryFn: () => getClientReviewDashboard(params),
    enabled: role === "client",
    placeholderData: keepPreviousData,
  });

  // common dashboard
  const reviewDashboardQuery = useQuery({
    queryKey: ["review-dashboard", params],
    queryFn: () => getReviewDashboard(params),
    enabled: !role,
    placeholderData: keepPreviousData,
  });

  // admin freelancers
  const adminFreelancersQuery = useQuery({
    queryKey: ["admin-freelancers", params],
    queryFn: () => getAdminFreelancers(params),
    enabled: role === "admin",
    placeholderData: keepPreviousData,
  });

  // admin clients
  const adminClientsQuery = useQuery({
    queryKey: ["admin-clients", params],
    queryFn: () => getAdminClients(params),
    enabled: role === "admin",
    placeholderData: keepPreviousData,
  });

  // admin categories
  const adminCategoriesQuery = useQuery({
    queryKey: ["admin-categories", params],
    queryFn: () => getAdminCategories(params),
    enabled: role === "admin",
    placeholderData: keepPreviousData,
  });

  // admin jobs
  const adminJobsQuery = useQuery({
    queryKey: ["admin-jobs", params],
    queryFn: () => getAdminJobs(params),
    enabled: role === "admin" || role === "freelancer",
    placeholderData: keepPreviousData,
  });

  const dashboardData =
    role === "freelancer"
      ? freelancerDashboardQuery.data?.data
      : role === "client"
      ? clientDashboardQuery.data?.data
      : reviewDashboardQuery.data?.data;

  return {
    dashboard: dashboardData || {},
    stats: dashboardData?.stats || {},
    reviews: dashboardData?.reviews || [],
    pagination: dashboardData?.pagination || {},

    // Freelancer & Client Stats
    totalReviews: dashboardData?.stats?.totalReviews || 0,

    totalBids: dashboardData?.stats?.totalBids || 0,

    acceptedBids: dashboardData?.stats?.acceptedBids || 0,

    rejectedBids: dashboardData?.stats?.rejectedBids || 0,

    pendingBids: dashboardData?.stats?.pendingBids || 0,

    averageRating: dashboardData?.stats?.averageRating || 0,

    // Jobs
    totalJobs:
      role === "client"
        ? dashboardData?.stats?.totalJobs || 0
        : adminJobsQuery.data?.totalJobs || 0,

    jobs: adminJobsQuery.data?.data || [],

    jobsPagination: adminJobsQuery.data?.pagination || {},

    // Admin Stats
    totalFreelancers:
      adminFreelancersQuery.data?.totalFreelancers || 0,

    freelancers:
      adminFreelancersQuery.data?.data || [],

    freelancersPagination:
      adminFreelancersQuery.data?.pagination || {},

    totalClients:
      adminClientsQuery.data?.totalClients || 0,

    clients:
      adminClientsQuery.data?.data || [],

    clientsPagination:
      adminClientsQuery.data?.pagination || {},

    totalCategories:
      adminCategoriesQuery.data?.totalCategories || 0,

    categories:
      adminCategoriesQuery.data?.data || [],

    categoriesPagination:
      adminCategoriesQuery.data?.pagination || {},

    isLoading:
      freelancerDashboardQuery.isLoading ||
      clientDashboardQuery.isLoading ||
      reviewDashboardQuery.isLoading ||
      adminFreelancersQuery.isLoading ||
      adminClientsQuery.isLoading ||
      adminCategoriesQuery.isLoading ||
      adminJobsQuery.isLoading,

    isFetching:
      freelancerDashboardQuery.isFetching ||
      clientDashboardQuery.isFetching ||
      reviewDashboardQuery.isFetching ||
      adminFreelancersQuery.isFetching ||
      adminClientsQuery.isFetching ||
      adminCategoriesQuery.isFetching ||
      adminJobsQuery.isFetching,
  };
};
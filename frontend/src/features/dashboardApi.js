import { api } from "@/services/api";

// freelancer review dashboard
export const getFreelancerReviewDashboard = async (params) => {
  const res = await api.get("/dashboard/freelancer-reviews", {
    params,
  });

  return res.data;
};

// client review dashboard
export const getClientReviewDashboard = async (params) => {
  const res = await api.get("/dashboard/client-reviews", {
    params,
  });

  return res.data;
};

// common review dashboard
export const getReviewDashboard = async (params) => {
  const res = await api.get("/dashboard/reviews", {
    params,
  });

  return res.data;
};
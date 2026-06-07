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

// admin freelancers
export const getAdminFreelancers = async (params) => {
  const res = await api.get("/dashboard/total-freelancer", {
    params,
  });

  return res.data;
};

// admin clients
export const getAdminClients = async (params) => {
  const res = await api.get("/dashboard/total-client", {
    params,
  });

  return res.data;
};

// admin categories
export const getAdminCategories = async (params) => {
  const res = await api.get("/dashboard/total-categories", {
    params,
  });

  return res.data;
};

// admin jobs
export const getAdminJobs = async (params) => {
  const res = await api.get("/dashboard/total-job", {
    params,
  });

  return res.data;
};

// freelancer earnings dashboard
export const getFreelancerEarningsDashboard = async () => {
  const res = await api.get("/dashboard/freelancer-earnings");
  return res.data;
};

// client payments dashboard
export const getClientPaymentsDashboard = async () => {
  const res = await api.get("/dashboard/client-payments");
  return res.data;
};

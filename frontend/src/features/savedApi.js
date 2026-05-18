import { api } from "@/services/api";

// save / unsave freelancer
export const toggleSaveFreelancer = async (data) => {
  const res = await api.patch("/saved/save-freelancer", data);
  return res.data;
};

// get saved freelancers
export const getSavedFreelancers = async (params) => {
  const res = await api.get("/saved/saved-freelancers", {
    params,
  });

  return res.data;
};

// save / unsave job
export const toggleSaveJob = async (data) => {
  const res = await api.patch("/saved/save-job", data);
  return res.data;
};

// get saved jobs
export const getSavedJobs = async (params) => {
  const res = await api.get("/saved/saved-jobs", {
    params,
  });

  return res.data;
};
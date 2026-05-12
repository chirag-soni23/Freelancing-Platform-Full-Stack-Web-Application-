import { api } from "@/services/api";

// create job
export const createJob = async (data) => {
  const res = await api.post("/job", data);
  return res.data;
};

// get all jobs
export const getJobs = async (params) => {
  const res = await api.get("/job", {
    params,
  });
  return res.data;
};

// get job by id
export const getJobById = async (id) => {
  const res = await api.get(`/job/${id}`);
  return res.data;
};

// update job
export const updateJob = async (id, data) => {
  const res = await api.patch(`/job/${id}`, data);
  return res.data;
};

// delete job
export const deleteJob = async (id) => {
  const res = await api.delete(`/job/${id}`);
  return res.data;
};

// toggle status
export const toggleJobStatus = async (id) => {
  const res = await api.patch(`/job/toggle-status/${id}`);
  return res.data;
};

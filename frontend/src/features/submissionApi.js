import { api } from "@/services/api";

// create submission
export const createSubmission = async (bidId, data) => {
  const res = await api.post(`/submission/${bidId}`, data);
  return res.data;
};

// get submission by bid
export const getSubmissionByBid = async (bidId) => {
  const res = await api.get(`/submission/${bidId}`);
  return res.data;
};

// update submission
export const updateSubmission = async (bidId, data) => {
  const res = await api.patch(`/submission/${bidId}`, data);
  return res.data;
};

// delete submission
export const deleteSubmission = async (bidId) => {
  const res = await api.delete(`/submission/${bidId}`);
  return res.data;
};

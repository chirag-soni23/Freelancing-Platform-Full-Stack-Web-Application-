import { api } from "@/services/api";

// create feedback
export const createFeedback = async (data) => {
  const res = await api.post("/feedback", data);
  return res.data;
};

// get user feedbacks
export const getUserFeedbacks = async (userId, params) => {
  const res = await api.get(`/feedback/${userId}`, {
    params,
  });

  return res.data;
};

// update feedback
export const updateFeedback = async (id, data) => {
  const res = await api.patch(`/feedback/${id}`, data);
  return res.data;
};

// delete feedback
export const deleteFeedback = async (id) => {
  const res = await api.delete(`/feedback/${id}`);
  return res.data;
};

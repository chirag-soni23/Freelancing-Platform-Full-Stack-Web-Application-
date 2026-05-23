import { api } from "@/services/api";

// create bid
export const createBid = async (data) => {
  const res = await api.post("/bid/create", data);

  return res.data;
};

// get my bids
export const getMyBids = async (params) => {
  const res = await api.get("/bid/my", {
    params,
  });

  return res.data;
};

// get bids by job
export const getJobBids = async (jobId) => {
  const res = await api.get(`/bid/job/${jobId}`);

  return res.data;
};

// accept bid
export const acceptBid = async (bidId) => {
  const res = await api.patch(`/bid/accept/${bidId}`);

  return res.data;
};

// reject bid
export const rejectBid = async (bidId) => {
  const res = await api.patch(`/bid/reject/${bidId}`);

  return res.data;
};

// delete bid
export const deleteBid = async (bidId) => {
  const res = await api.delete(`/bid/${bidId}`);

  return res.data;
};

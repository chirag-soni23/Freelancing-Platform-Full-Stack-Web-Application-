import { api } from "@/services/api";

// create payment session
export const createPayment = async (bidId) => {
  const res = await api.post(`/payment/create/${bidId}`);
  return res.data;
};

// get payment status
export const getPaymentStatus = async (bidId) => {
  const res = await api.get(`/payment/status/${bidId}`);
  return res.data;
};

// get my payments
export const getMyPayments = async () => {
  const res = await api.get("/payment/my-payments");
  return res.data;
};

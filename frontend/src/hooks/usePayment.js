import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createPayment,
  getPaymentStatus,
  getMyPayments,
} from "@/features/paymentApi";

import { toast } from "./use-toast";

export const usePayment = (bidId) => {
  // payment status
  const paymentStatusQuery = useQuery({
    queryKey: ["payment-status", bidId],
    queryFn: () => getPaymentStatus(bidId),
    enabled: !!bidId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // my payments
  const myPaymentsQuery = useQuery({
    queryKey: ["my-payments"],
    queryFn: getMyPayments,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // create payment
  const createPaymentMutation = useMutation({
    mutationFn: (bidId) => createPayment(bidId),

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Redirecting to payment...",
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    },

    onError: (err) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
    },
  });

  return {
    // payment status
    payment: paymentStatusQuery.data?.data || null,
    isLoadingPayment: paymentStatusQuery.isLoading,

    // create payment
    createPayment: createPaymentMutation.mutate,
    isCreatingPayment: createPaymentMutation.isPending,

    // my payments
    payments: myPaymentsQuery.data?.data || [],
    isLoadingPayments: myPaymentsQuery.isLoading,
  };
};

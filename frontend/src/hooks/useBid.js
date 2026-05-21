import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createBid,
  getMyBids,
  getJobBids,
  acceptBid,
  rejectBid,
  deleteBid,
} from "@/features/bidApi";

import { toast } from "./use-toast";

export const useBid = (jobId) => {
  const queryClient = useQueryClient();

  // my bids
  const myBidsQuery = useQuery({
    queryKey: ["my-bids"],

    queryFn: getMyBids,

    refetchOnWindowFocus: false,
  });

  // job bids
  const jobBidsQuery = useQuery({
    queryKey: ["job-bids", jobId],

    queryFn: () => getJobBids(jobId),

    enabled: !!jobId,

    refetchOnWindowFocus: false,
  });

  // create bid
  const createBidMutation = useMutation({
    mutationFn: createBid,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-bids"]);

      queryClient.invalidateQueries(["job-bids"]);

      toast({
        title: "Success",

        description: data?.message || "Bid created successfully",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description: err?.response?.data?.message || err.message,

        variant: "destructive",
      });
    },
  });

  // accept bid
  const acceptBidMutation = useMutation({
    mutationFn: acceptBid,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["job-bids"]);

      toast({
        title: "Success",

        description: data?.message || "Bid accepted",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description: err?.response?.data?.message || err.message,

        variant: "destructive",
      });
    },
  });

  // reject bid
  const rejectBidMutation = useMutation({
    mutationFn: rejectBid,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["job-bids"]);

      toast({
        title: "Success",

        description: data?.message || "Bid rejected",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description: err?.response?.data?.message || err.message,

        variant: "destructive",
      });
    },
  });

  // delete bid
  const deleteBidMutation = useMutation({
    mutationFn: deleteBid,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-bids"]);

      toast({
        title: "Success",

        description: data?.message || "Bid deleted",
      });
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
    // my bids
    myBids: myBidsQuery.data?.data || [],

    isLoadingMyBids: myBidsQuery.isLoading,

    // job bids
    jobBids: jobBidsQuery.data?.data || [],

    isLoadingJobBids: jobBidsQuery.isLoading,

    // create
    createBid: createBidMutation.mutate,

    isCreatingBid: createBidMutation.isPending,

    // accept
    acceptBid: acceptBidMutation.mutate,

    isAcceptingBid: acceptBidMutation.isPending,

    // reject
    rejectBid: rejectBidMutation.mutate,

    isRejectingBid: rejectBidMutation.isPending,

    // delete
    deleteBid: deleteBidMutation.mutate,

    isDeletingBid: deleteBidMutation.isPending,
  };
};

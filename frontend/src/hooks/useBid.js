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

export const useBid = (jobId, params) => {
  const queryClient = useQueryClient();

  // my bids
  const myBidsQuery = useQuery({
    queryKey: ["my-bids", params],
    queryFn: () => getMyBids(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // job bids
  const jobBidsQuery = useQuery({
    queryKey: ["job-bids", jobId, params],
    queryFn: () => getJobBids(jobId, params),
    enabled: !!jobId,
    keepPreviousData: true,
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
      queryClient.invalidateQueries({
        queryKey: ["job-bids"],
      });

      toast({
        title: "Success",

        description: data?.message || "Bid accepted",
      });
    },
  });

  // reject bid
  const rejectBidMutation = useMutation({
    mutationFn: rejectBid,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["job-bids"],
      });

      toast({
        title: "Success",

        description: data?.message || "Bid rejected",
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
    pagination: myBidsQuery.data?.pagination || {},

    isLoadingMyBids: myBidsQuery.isLoading,

    // job bids
    jobBids: jobBidsQuery.data?.data || [],
    jobBidsPagination: jobBidsQuery.data?.pagination || {},
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

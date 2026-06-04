import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSubmission,
  getSubmissionByBid,
  updateSubmission,
  deleteSubmission,
} from "@/features/submissionApi";

import { toast } from "./use-toast";

export const useSubmission = (bidId) => {
  const queryClient = useQueryClient();

  // get submission
  const submissionQuery = useQuery({
    queryKey: ["submission", bidId],

    queryFn: () => getSubmissionByBid(bidId),

    enabled: !!bidId,

    staleTime: 1000 * 60,

    gcTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,

    retry: 1,
  });

  // create submission
  const createMutation = useMutation({
    mutationFn: (data) => createSubmission(bidId, data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", bidId],
      });

      toast({
        title: "Success",
        description: data?.message || "Submission created successfully",
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

  // update submission
  const updateMutation = useMutation({
    mutationFn: (data) => updateSubmission(bidId, data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", bidId],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["my-bids"],
      });

      toast({
        title: "Success",
        description: data?.message || "Submission updated successfully",
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

  // delete submission
  const deleteMutation = useMutation({
    mutationFn: () => deleteSubmission(bidId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", bidId],
      });

      toast({
        title: "Success",
        description: data?.message || "Submission deleted successfully",
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
    // data
    submission: submissionQuery.data?.data || null,

    // loading
    isLoading: submissionQuery.isLoading,

    isFetching: submissionQuery.isFetching,

    // create
    createSubmission: createMutation.mutate,

    isCreating: createMutation.isPending,

    // update
    updateSubmission: updateMutation.mutate,

    isUpdating: updateMutation.isPending,

    // delete
    deleteSubmission: deleteMutation.mutate,

    isDeleting: deleteMutation.isPending,
  };
};

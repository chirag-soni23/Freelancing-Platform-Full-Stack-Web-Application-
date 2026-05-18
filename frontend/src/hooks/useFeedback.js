import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFeedback,
  deleteFeedback,
  getUserFeedbacks,
  updateFeedback,
} from "@/features/feedbackApi";

import { toast } from "./use-toast";

export const useFeedback = (userId, params) => {
  const queryClient = useQueryClient();

  // get feedbacks
  const feedbacksQuery = useQuery({
    queryKey: ["feedbacks", userId, params],

    queryFn: () => getUserFeedbacks(userId, params),

    enabled: !!userId,
    keepPreviousData: true,
    staleTime: 5000,
  });

  // create feedback
  const createFeedbackMutation = useMutation({
    mutationFn: createFeedback,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["feedbacks"]);

      toast({
        title: "Success",
        description: data?.message || "Feedback submitted successfully",
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

  // update feedback
  const updateFeedbackMutation = useMutation({
    mutationFn: ({ id, data }) => updateFeedback(id, data),

    onSuccess: (data) => {
      queryClient.invalidateQueries(["feedbacks"]);

      toast({
        title: "Success",
        description: data?.message || "Feedback updated successfully",
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

  // delete feedback
  const deleteFeedbackMutation = useMutation({
    mutationFn: deleteFeedback,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["feedbacks"]);

      toast({
        title: "Success",
        description: data?.message || "Feedback deleted successfully",
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
    // feedbacks
    feedbacks: feedbacksQuery.data?.data?.feedbacks || [],
    averageRating: feedbacksQuery.data?.data?.averageRating || 0,
    totalReviews: feedbacksQuery.data?.data?.totalReviews || 0,

    feedbackPagination: feedbacksQuery.data?.pagination || {},

    isLoadingFeedbacks: feedbacksQuery.isLoading,
    isFetchingFeedbacks: feedbacksQuery.isFetching,

    // create
    createFeedback: createFeedbackMutation.mutate,
    isCreatingFeedback: createFeedbackMutation.isPending,

    // update
    updateFeedback: updateFeedbackMutation.mutate,
    isUpdatingFeedback: updateFeedbackMutation.isPending,

    // delete
    deleteFeedback: deleteFeedbackMutation.mutate,
    isDeletingFeedback: deleteFeedbackMutation.isPending,
  };
};

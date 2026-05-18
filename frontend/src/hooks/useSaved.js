import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  toggleSaveFreelancer,
  getSavedFreelancers,
  toggleSaveJob,
  getSavedJobs,
} from "@/features/savedApi";

import { toast } from "@/hooks/use-toast";

export const useSaved = (params) => {
  const queryClient = useQueryClient();

  // saved freelancer
  const savedFreelancersQuery = useQuery({
    queryKey: ["saved-freelancers", params],

    queryFn: () => getSavedFreelancers(params),

    keepPreviousData: true,
  });

  // saved jobs
  const savedJobsQuery = useQuery({
    queryKey: ["saved-jobs", params],

    queryFn: () => getSavedJobs(params),

    keepPreviousData: true,
  });

  // toggle saved freelancer
  const toggleFreelancerMutation = useMutation({
    mutationFn: toggleSaveFreelancer,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-freelancers"],
      });

      toast({
        title: "Success",

        description: data?.message || "Freelancer updated",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description:
          err?.response?.data?.message || "Failed to save freelancer",

        variant: "destructive",
      });
    },
  });

  // toggle save job
  const toggleJobMutation = useMutation({
    mutationFn: toggleSaveJob,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-jobs"],
      });

      toast({
        title: "Success",

        description: data?.message || "Job updated",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description: err?.response?.data?.message || "Failed to save job",

        variant: "destructive",
      });
    },
  });

  return {
    // ================= DATA =================

    savedFreelancers: savedFreelancersQuery.data?.data || [],

    savedFreelancerPagination: savedFreelancersQuery.data?.pagination || {},

    savedJobs: savedJobsQuery.data?.data || [],

    savedJobsPagination: savedJobsQuery.data?.pagination || {},

    // ================= LOADING =================

    isSavedFreelancersLoading: savedFreelancersQuery.isLoading,

    isSavedJobsLoading: savedJobsQuery.isLoading,

    // ================= SAVE / UNSAVE =================

    toggleSaveFreelancer: toggleFreelancerMutation.mutate,

    isTogglingFreelancer: toggleFreelancerMutation.isPending,

    toggleSaveJob: toggleJobMutation.mutate,

    isTogglingJob: toggleJobMutation.isPending,
  };
};

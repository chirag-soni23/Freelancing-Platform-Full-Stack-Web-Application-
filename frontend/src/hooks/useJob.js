import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getMyJobs,
} from "@/features/jobApi";
import { toast } from "./use-toast";

export const useJob = (jobId, params) => {
  const queryClient = useQueryClient();

  // get all jobs
  const jobsQuery = useQuery({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
    keepPreviousData: true,
  });

  const MyjobsQuery = useQuery({
    queryKey: ["my-jobs", params],
    queryFn: () => getMyJobs(params),
    keepPreviousData: true,
  });

  // get single job
  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
  });

  // create job
  const createJobMutation = useMutation({
    mutationFn: createJob,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });

      toast({
        title: "Success",
        description: data?.message || "Job created successfully 🚀",
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

  // update job
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      if (!id) throw new Error("Job ID is missing");
      const res = await updateJob(id, data);
      return res;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["job", variables.id],
      });

      toast({
        title: "Success",
        description: data?.message || "Job updated successfully",
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

  // delete job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      queryClient.invalidateQueries({
        queryKey: ["my-jobs"],
      });

      toast({
        title: "Success",
        description: data?.message || "Job deleted successfully",
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

  // toggle job status
  const toggleJobStatusMutation = useMutation({
    mutationFn: toggleJobStatus,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["jobs"]);
      queryClient.invalidateQueries(["job", jobId]);

      toast({
        title: "Success",
        description: data?.message || "Job status updated 🔄",
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
    // all jobs
    jobs: jobsQuery.data?.data || [],
    pagination: jobsQuery.data?.pagination || {},
    isLoadingJobs: jobsQuery.isLoading,

    // my jobs
    myJobs: MyjobsQuery.data?.data || [],
    Mypagination: MyjobsQuery.data?.pagination || {},
    MyisLoadingJobs: MyjobsQuery.isLoading,

    // toggle status
    toggleStatus: toggleJobStatusMutation.mutate,
    isTogglingStatus: toggleJobStatusMutation.isPending,

    // single job
    job: jobQuery.data,
    isLoadingJob: jobQuery.isLoading,

    // create
    createJob: createJobMutation.mutate,
    isCreatingJob: createJobMutation.isPending,

    // update
    updateJob: updateJobMutation.mutateAsync,
    isUpdatingJob: updateJobMutation.isPending,

    // delete
    deleteJob: deleteJobMutation.mutate,
    isDeletingJob: deleteJobMutation.isPending,
  };
};

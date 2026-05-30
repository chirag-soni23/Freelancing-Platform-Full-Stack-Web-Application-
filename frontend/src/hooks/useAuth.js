import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // registerClient,
  // registerFreelancer,
  login,
  getMe,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  resetPasswordWithToken,
  resendVerification,
  verifyEmail,
  updateProfilePic,
  uploadProfilePic,
  getFreelancers,
  getClients,
  getFreelancerById,
  registerUser,
} from "@/features/authApi";
import { toast } from "./use-toast";

export const useAuth = (params, freelancerId) => {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const freelancersQuery = useQuery({
    queryKey: ["freelancers", params],
    queryFn: () => getFreelancers(params),
    keepPreviousData: true,
    staleTime: 5000,
  });

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const freelancerQuery = useQuery({
    queryKey: ["freelancer", freelancerId],
    queryFn: () => getFreelancerById(freelancerId),
    enabled: !!freelancerId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "registered successfully 🚀",
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

  // const registerFreelancerMutation = useMutation({
  //   mutationFn: registerFreelancer,

  //   onSuccess: (data) => {
  //     toast({
  //       title: "Success",
  //       description: data?.message || "Freelancer registered successfully 🚀",
  //     });
  //   },

  //   onError: (err) => {
  //     toast({
  //       title: "Error",
  //       description: err?.response?.data?.message || err.message,
  //       variant: "destructive",
  //     });
  //   },
  // });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["me"],
      });
      toast({
        title: "Success",
        description: "Login successful",
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

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.clear();

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "Logout failed",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);

      toast({
        title: "Success",
        description: data?.message || "Profile updated",
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

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Reset link sent",
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

  // upload profile pic
  const uploadProfilePicMutation = useMutation({
    mutationFn: uploadProfilePic,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);

      toast({
        title: "Success",
        description: data?.message || "Profile picture uploaded",
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

  // update profile pic
  const updateProfilePicMutation = useMutation({
    mutationFn: updateProfilePic,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["me"]);

      toast({
        title: "Success",
        description: data?.message || "Profile picture updated",
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

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Password updated",
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

  const resetPasswordWithTokenMutation = useMutation({
    mutationFn: ({ token, data }) => resetPasswordWithToken(token, data),

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Password reset successful",
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

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Email verified",
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

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerification,

    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Verification email sent",
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
    // user
    user: meQuery.data,
    isLoadingUser: meQuery.isLoading,

    // register
    // registerClient: registerClientMutation.mutate,
    // isRegisteringClient: registerClientMutation.isPending,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,

    // registerFreelancer: registerFreelancerMutation.mutate,
    // isRegisteringFreelancer: registerFreelancerMutation.isPending,

    // login
    login: loginMutation.mutate,
    isLogging: loginMutation.isPending,

    // logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // profile
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,

    // password
    forgotPassword: forgotPasswordMutation.mutate,
    isLoadingForgot: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordWithToken: resetPasswordWithTokenMutation.mutate,
    isResetting: resetPasswordWithTokenMutation.isPending,

    freelancers: freelancersQuery.data?.data ?? [],
    freelancerPagination: freelancersQuery.data?.pagination || {},
    isFetchingFreelancers: freelancersQuery.isFetching,
    clients: clientsQuery.data?.data || [],

    isLoadingFreelancers: freelancersQuery.isLoading,
    isLoadingClients: clientsQuery.isLoading,

    // single freelancer
    freelancer: freelancerQuery.data?.data || null,
    isLoadingFreelancer: freelancerQuery.isLoading,

    // email
    verifyEmail: verifyEmailMutation.mutateAsync,
    resendVerification: resendVerificationMutation.mutateAsync,

    uploadProfilePic: uploadProfilePicMutation.mutate,
    isUploadingProfilePic: uploadProfilePicMutation.isPending,

    updateProfilePic: updateProfilePicMutation.mutate,
    isUpdatingProfilePic: updateProfilePicMutation.isPending,
  };
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "@/features/notificationApi";

import { toast } from "./use-toast";

export const useNotification = (params) => {
  const queryClient = useQueryClient();

  // get notifications
  const notificationsQuery = useQuery({
    queryKey: ["notifications", params],

    queryFn: () => getNotifications(params),

    // keep old data while loading next page/search
    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60,

    gcTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,

    refetchOnReconnect: false,

    retry: 1,
  });

  // mark read
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast({
        title: "Success",

        description: data?.message || "Notification marked read",
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

  // delete notification
  const deleteMutation = useMutation({
    mutationFn: deleteNotification,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast({
        title: "Success",

        description: data?.message || "Notification deleted",
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
    notifications: notificationsQuery.data?.data || [],

    unreadCount: notificationsQuery.data?.unreadCount || 0,

    pagination: notificationsQuery.data?.pagination || {},

    // loading
    isLoading: notificationsQuery.isLoading,

    isFetching: notificationsQuery.isFetching,

    isRefetching: notificationsQuery.isRefetching,

    // mark read
    markRead: markReadMutation.mutate,

    isMarkingRead: markReadMutation.isPending,

    // delete
    deleteNotification: deleteMutation.mutate,

    isDeleting: deleteMutation.isPending,
  };
};

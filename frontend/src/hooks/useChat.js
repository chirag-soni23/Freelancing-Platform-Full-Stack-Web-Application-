import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  startChat,
  sendMessage,
  getMessages,
  getMyConversations,
} from "@/features/chatApi";

import { toast } from "./use-toast";

export const useChat = (conversationId) => {
  const queryClient = useQueryClient();

  /* =========================
     CONVERSATIONS
  ========================= */

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],

    queryFn: getMyConversations,

    retry: false,

    refetchOnWindowFocus: false,
  });

  /* =========================
     MESSAGES
  ========================= */

  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],

    queryFn: () => getMessages(conversationId),

    enabled: !!conversationId,

    retry: false,

    refetchOnWindowFocus: false,
  });

  /* =========================
     START CHAT
  ========================= */

  const startChatMutation = useMutation({
    mutationFn: startChat,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      toast({
        title: "Success",

        description: data?.message || "Chat started successfully 🚀",
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

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
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
    conversations: conversationsQuery.data?.data || [],
    isLoadingConversations: conversationsQuery.isLoading,
    refetchConversations: conversationsQuery.refetch,
    messages: messagesQuery.data?.data || [],
    isLoadingMessages: messagesQuery.isLoading,
    refetchMessages: messagesQuery.refetch,
    startChat: startChatMutation.mutate,
    isStartingChat: startChatMutation.isPending,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
  };
};

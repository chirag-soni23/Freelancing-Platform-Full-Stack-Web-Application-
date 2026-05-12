import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  startChat,
  sendMessage,
  getMessages,
} from "@/features/chatApi";

import { toast } from "./use-toast";

export const useChat = (
  conversationId
) => {
  const queryClient =
    useQueryClient();

  /* =========================
     GET MESSAGES
  ========================= */

  const messagesQuery = useQuery({
    queryKey: [
      "messages",
      conversationId,
    ],

    queryFn: () =>
      getMessages(conversationId),

    enabled: !!conversationId,

    retry: false,

    refetchOnWindowFocus: false,
  });

  /* =========================
     START CHAT
  ========================= */

  const startChatMutation =
    useMutation({
      mutationFn: startChat,

      onSuccess: (data) => {
        toast({
          title: "Success",

          description:
            data?.message ||
            "Chat started successfully 🚀",
        });
      },

      onError: (err) => {
        toast({
          title: "Error",

          description:
            err?.response?.data
              ?.message ||
            err.message,

          variant: "destructive",
        });
      },
    });

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessageMutation =
    useMutation({
      mutationFn: sendMessage,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "messages",
            conversationId,
          ],
        });
      },

      onError: (err) => {
        toast({
          title: "Error",

          description:
            err?.response?.data
              ?.message ||
            err.message,

          variant: "destructive",
        });
      },
    });

  return {
    /* messages */
    messages:
      messagesQuery.data?.data ||
      [],

    isLoadingMessages:
      messagesQuery.isLoading,

    refetchMessages:
      messagesQuery.refetch,

    /* start chat */
    startChat:
      startChatMutation.mutate,

    isStartingChat:
      startChatMutation.isPending,

    /* send message */
    sendMessage:
      sendMessageMutation.mutate,

    isSendingMessage:
      sendMessageMutation.isPending,
  };
};
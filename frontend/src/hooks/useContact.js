import { useMutation } from "@tanstack/react-query";

import { createContact } from "@/features/contactApi";

import { toast } from "./use-toast";

export const useContact = () => {
  // create contact
  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Message sent successfully 🚀",
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
    // create
    createContact: createContactMutation.mutate,

    isCreatingContact: createContactMutation.isPending,
  };
};

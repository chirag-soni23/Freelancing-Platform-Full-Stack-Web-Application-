import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategory,
  getCategories,
  getUniqueCategories,
  updateCategory,
  deleteCategory,
} from "@/features/categoryApi";

import { toast } from "@/hooks/use-toast";

export const useCategory = (params) => {
  const queryClient = useQueryClient();

  // get category
  const categoryQuery = useQuery({
    queryKey: ["categories", params],

    queryFn: () => getCategories(params),

    keepPreviousData: true,
  });

  // get unique categories
  const uniqueCategoryQuery = useQuery({
    queryKey: ["unique-categories", params],

    queryFn: () => getUniqueCategories(params),
  });

  // create category
  const createMutation = useMutation({
    mutationFn: createCategory,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["unique-categories"],
      });

      toast({
        title: "Success",

        description: data?.message || "Category created",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description:
          err?.response?.data?.message || "Failed to create category",

        variant: "destructive",
      });
    },
  });

  // update category
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["unique-categories"],
      });

      toast({
        title: "Success",

        description: data?.message || "Category updated",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description:
          err?.response?.data?.message || "Failed to update category",

        variant: "destructive",
      });
    },
  });

  // delete category
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["unique-categories"],
      });

      toast({
        title: "Success",

        description: data?.message || "Category deleted",
      });
    },

    onError: (err) => {
      toast({
        title: "Error",

        description:
          err?.response?.data?.message || "Failed to delete category",

        variant: "destructive",
      });
    },
  });

  return {
    // data
    categories: categoryQuery.data?.data || [],

    uniqueCategories: uniqueCategoryQuery.data?.data || [],

    pagination: categoryQuery.data?.pagination || {},

    isLoading: categoryQuery.isLoading,

    isUniqueLoading: uniqueCategoryQuery.isLoading,

    // create
    createCategory: createMutation.mutate,

    isCreating: createMutation.isPending,

    // update
    updateCategory: updateMutation.mutate,

    isUpdating: updateMutation.isPending,

    // delete
    deleteCategory: deleteMutation.mutate,

    isDeleting: deleteMutation.isPending,
  };
};

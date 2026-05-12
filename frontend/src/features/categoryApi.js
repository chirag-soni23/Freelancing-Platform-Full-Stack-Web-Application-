import { api } from "@/services/api";

//  create category
export const createCategory = async (data) => {
  const res = await api.post("/category", data);
  return res.data;
};

//  get categories
export const getCategories = async (params) => {
  const res = await api.get("/category", {
    params,
  });
  return res.data;
};

//  update category
export const updateCategory = async (id, data) => {
  const res = await api.patch(`/category/${id}`, data);
  return res.data;
};

//  delete category
export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/${id}`);
  return res.data;
};

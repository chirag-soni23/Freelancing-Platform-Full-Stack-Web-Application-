import { api } from "@/services/api";

// create contact
export const createContact = async (data) => {
  const res = await api.post("/contact/create", data);

  return res.data;
};

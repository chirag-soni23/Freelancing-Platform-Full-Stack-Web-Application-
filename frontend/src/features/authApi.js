import { api } from "@/services/api";

// register user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// login
export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// get current user
export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    return null;
  }
};

// logout
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

// update profile
export const updateProfile = async (data) => {
  const res = await api.patch("/auth/update-profile", data);
  return res.data;
};

// upload profile pic
export const uploadProfilePic = async (formData) => {
  const res = await api.post("/auth/upload-profile-pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// update profile pic
export const updateProfilePic = async (formData) => {
  const res = await api.patch("/auth/update-profile-pic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// forgot password
export const forgotPassword = async (data) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};

// reset password (logged in)
export const resetPassword = async (data) => {
  const res = await api.patch("/auth/reset-password", data);
  return res.data;
};

// reset password with token
export const resetPasswordWithToken = async (token, data) => {
  const res = await api.patch(`/auth/reset-password/${token}`, data);
  return res.data;
};

// verify email
export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
};

// resend verification email
export const resendVerification = async () => {
  const res = await api.post("/auth/resend-verification");
  return res.data;
};

// get all freelancers
export const getFreelancers = async (params) => {
  const res = await api.get("/auth/getall-freelancer", {
    params,
  });
  return res.data;
};

// get all clients
export const getClients = async () => {
  const res = await api.get("/auth/getall-client");
  return res.data;
};

// get freelancer by id
export const getFreelancerById = async (id) => {
  const res = await api.get(`/auth/freelancer/${id}`);
  return res.data;
};

// get client by id
export const getClientById = async (id) => {
  const res = await api.get(`/auth/client/${id}`);
  return res.data;
};

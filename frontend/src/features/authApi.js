import { api } from "@/services/api";

// register client
export const registerClient = async (data) => {
  const res = await api.post("/auth/register-client", data);
  return res.data;
};

// register freelancer
export const registerFreelancer = async (data) => {
  const res = await api.post("/auth/register-freelancer", data);
  return res.data;
};

// login client
export const loginClient = async (data) => {
  const res = await api.post("/auth/login-client", data);
  return res.data;
};

// login freelancer
export const loginFreelancer = async (data) => {
  const res = await api.post("/auth/login-freelance", data);
  return res.data;
};

// get current user
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
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

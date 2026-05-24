import { api } from "@/services/api";

// get notifications
export const getNotifications = async (params) => {
  const res = await api.get("/notifications", {
    params,
  });

  return res.data;
};

// mark notification read
export const markNotificationRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);

  return res.data;
};

// delete notification
export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);

  return res.data;
};

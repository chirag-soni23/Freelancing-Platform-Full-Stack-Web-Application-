// services/chat.service.js

import { api } from "@/services/api";

// CREATE / START CHAT
export const startChat = async (data) => {
  const res = await api.post("/chat/conversation", data);

  return res.data;
};

// SEND MESSAGE
export const sendMessage = async (data) => {
  const res = await api.post("/chat/message", data);

  return res.data;
};

// GET MESSAGES
export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/messages/${conversationId}`);

  return res.data;
};

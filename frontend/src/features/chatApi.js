import { api } from "@/services/api";

// start chat
export const startChat = async (data) => {
  const res = await api.post("/chat/start", data);

  return res.data;
};

// send message
export const sendMessage = async (data) => {
  const res = await api.post("/chat/send", data);

  return res.data;
};

// get messages
export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/${conversationId}`);

  return res.data;
};

// get my conversations
export const getMyConversations = async () => {
  const res = await api.get("/chat/my-conversations");

  return res.data;
};

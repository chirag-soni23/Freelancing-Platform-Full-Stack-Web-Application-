import { api } from "@/services/api";

// start chat
export const startChat = async (data) => {
  const res = await api.post("/chat/conversation", data);

  return res.data;
};

// send messages
export const sendMessage = async (data) => {
  const res = await api.post("/chat/message", data);

  return res.data;
};

// get messages
export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/messages/${conversationId}`);

  return res.data;
};

// get my conversations
export const getMyConversations = async () => {
  const res = await api.get("/chat/conversations");

  return res.data;
};

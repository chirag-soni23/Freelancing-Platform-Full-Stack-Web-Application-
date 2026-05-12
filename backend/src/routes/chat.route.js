import express from "express";

import {
  startChat,
  sendMessage,
  getMessages,
  getMyConversations,
} from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/start", startChat);
router.get("/my-conversations", getMyConversations);
router.post("/send", sendMessage);
router.get("/:conversationId", getMessages);

export default router;

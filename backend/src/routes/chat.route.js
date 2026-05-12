import express from "express";

import {
  createConversation,
  sendMessage,
  getMessages,
  getMyConversations,
} from "../controllers/chat.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/conversation", createConversation);
router.post("/message", sendMessage);
router.get("/conversations", getMyConversations);
router.get("/messages/:conversationId", getMessages);


export default router;

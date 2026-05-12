import express from "express";

import {
  createConversation,
  sendMessage,
  getMessages,
} from "../controllers/chat.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/conversation", createConversation);
router.post("/message", sendMessage);
router.get("/messages/:conversationId", getMessages);

export default router;

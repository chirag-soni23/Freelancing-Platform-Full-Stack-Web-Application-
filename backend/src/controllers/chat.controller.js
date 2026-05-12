import { Op } from "sequelize";
import db from "../models/index.js";
import { StatusCodes } from "../config/index.js";
import { successResponse } from "../utils/apiResponse.js";

// create conversation
export const createConversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { receiverId } = req.body;

    const sender = await db.User.findByPk(senderId);

    // receiver user
    const receiver = await db.User.findByPk(receiverId);

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    const validConversation =
      (sender.role === "client" && receiver.role === "freelancer") ||
      (sender.role === "freelancer" && receiver.role === "client");

    if (!validConversation) {
      throw new Error("Only client and freelancer can chat");
    }

    let conversation = await db.Conversation.findOne({
      where: {
        [Op.or]: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
    });

    // CREATE NEW
    if (!conversation) {
      conversation = await db.Conversation.create({
        senderId,
        receiverId,
      });
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Conversation ready",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// send message
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { conversationId, receiverId, text } = req.body;

    const message = await db.Message.create({
      conversationId,
      senderId,
      receiverId,
      text,
      isRead: false,
    });

    return successResponse(res, 201, {
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// get messages
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await db.Message.findAll({
      where: {
        conversationId,
      },

      order: [["createdAt", "ASC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await db.Conversation.findAll({
      where: {
        [Op.or]: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },

      include: [
        {
          model: db.User,
          as: "sender",

          attributes: ["id", "name", "profilePic"],
        },

        {
          model: db.User,
          as: "receiver",

          attributes: ["id", "name", "profilePic"],
        },
      ],

      order: [["updatedAt", "DESC"]],
    });

    return successResponse(res, 200, {
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

import { Op } from "sequelize";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

// start chat
export const startChat = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const { userId } = req.body;

    if (currentUserId === userId) {
      throw ApiError.BADREQUEST("You cannot chat with yourself");
    }

    const user = await db.User.findByPk(userId);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    // existing chat check

    let conversation = await db.Conversation.findOne({
      where: {
        [Op.or]: [
          {
            userOneId: currentUserId,
            userTwoId: userId,
          },

          {
            userOneId: userId,
            userTwoId: currentUserId,
          },
        ],
      },
    });

    // create if not exists

    if (!conversation) {
      conversation = await db.Conversation.create({
        userOneId: currentUserId,
        userTwoId: userId,
      });
    }

    return successResponse(res, 200, {
      message: "Chat started successfully",
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

    const { conversationId, text } = req.body;

    const conversation = await db.Conversation.findByPk(conversationId);

    if (!conversation) {
      throw ApiError.NOTFOUND("Conversation not found");
    }

    // SECURITY CHECK

    const isParticipant =
      conversation.userOneId === senderId ||
      conversation.userTwoId === senderId;

    if (!isParticipant) {
      throw ApiError.UNAUTHORIZED("Unauthorized access");
    }

    const message = await db.Message.create({
      conversationId,
      senderId,
      text,
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

      include: [
        {
          model: db.User,
          as: "sender",

          attributes: ["id", "name", "profilePic"],
        },
      ],

      order: [["createdAt", "ASC"]],
    });

    return successResponse(res, 200, {
      message: "Messages fetched",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// get my conversions
export const getMyConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await db.Conversation.findAll({
      where: {
        [Op.or]: [
          {
            userOneId: userId,
          },

          {
            userTwoId: userId,
          },
        ],
      },

      include: [
        {
          model: db.User,
          as: "userOne",

          attributes: ["id", "name", "profilePic", "role"],
        },

        {
          model: db.User,
          as: "userTwo",

          attributes: ["id", "name", "profilePic", "role"],
        },
      ],

      order: [["updatedAt", "DESC"]],
    });

    return successResponse(res, 200, {
      message: "Conversations fetched successfully",

      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

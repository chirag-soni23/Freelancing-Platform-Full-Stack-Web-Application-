import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "../config/index.js";

// create feedback
export const createFeedback = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { receiverId, rating, comment } = req.body;

    if (!receiverId || !rating) {
      throw ApiError.BADREQUEST("Receiver id and rating are required");
    }

    if (senderId === receiverId) {
      throw ApiError.BADREQUEST("You cannot give feedback to yourself");
    }

    const receiver = await db.User.findByPk(receiverId);

    if (!receiver) {
      throw ApiError.NOTFOUND("Receiver user not found");
    }

    const feedback = await db.Feedback.create({
      senderId,
      receiverId,
      rating,
      comment,
    });

    return successResponse(res, StatusCodes.CREATED, {
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// get feedbacks of user
export const getUserFeedbacks = async (req, res, next) => {
  try {
    const { userId } = req.params;

    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
      throw ApiError.BADREQUEST("Page must be a positive integer");
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      throw ApiError.BADREQUEST("Limit must be between 1 and 50");
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await db.Feedback.findAndCountAll({
      where: {
        receiverId: userId,
      },

      limit,
      offset,

      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "role"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    // average rating
    const totalRatings = rows.reduce((acc, item) => acc + item.rating, 0);

    const averageRating =
      rows.length > 0 ? (totalRatings / rows.length).toFixed(1) : 0;

    return successResponse(res, StatusCodes.OK, {
      message: "Feedbacks fetched successfully",

      data: {
        averageRating,
        totalReviews: count,
        feedbacks: rows,
      },

      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// update feedback
export const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rating, comment } = req.body;

    const feedback = await db.Feedback.findByPk(id);

    if (!feedback) {
      throw ApiError.NOTFOUND("Feedback not found");
    }

    // only sender can update
    if (feedback.senderId !== req.user.id) {
      throw ApiError.FORBIDDEN("You are not allowed to update this feedback");
    }

    if (rating !== undefined) {
      feedback.rating = rating;
    }

    if (comment !== undefined) {
      feedback.comment = comment;
    }

    await feedback.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// delete feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const feedback = await db.Feedback.findByPk(id);

    if (!feedback) {
      throw ApiError.NOTFOUND("Feedback not found");
    }

    // sender or admin
    if (feedback.senderId !== req.user.id && req.user.role !== "admin") {
      throw ApiError.FORBIDDEN("You are not allowed to delete this feedback");
    }

    await feedback.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import db from "../models/index.js";
import { StatusCodes } from "../config/index.js";
import { successResponse } from "../utils/apiResponse.js";

// get notifications
export const getNotifications = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
      throw ApiError.BADREQUEST("Page must be positive integer");
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      throw ApiError.BADREQUEST("Limit must be between 1 and 50");
    }

    const offset = (page - 1) * limit;

    let where = {};

    // search
    if (search && search.trim().length > 0) {
      where = {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search.trim()}%`,
            },
          },
          {
            message: {
              [Op.like]: `%${search.trim()}%`,
            },
          },
          {
            "$client.name$": {
              [Op.like]: `%${search.trim()}%`,
            },
          },
        ],
      };
    }

    const { count, rows: notifications } =
      await db.Notification.findAndCountAll({
        where,

        include: [
          {
            model: db.User,

            as: "client",

            attributes: ["id", "name", "email", "profilePic"],

            required: false,
          },
        ],

        limit,
        offset,

        distinct: true,

        order: [["createdAt", "DESC"]],
      });

    // unread count
    const unreadCount = await db.Notification.count({
      where: {
        isRead: false,
      },
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Notifications fetched successfully",

      data: notifications,

      unreadCount,

      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error.message);

    next(error);
  }
};


// mark read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await db.Notification.findOne({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.isRead = true;

    await notification.save();

    return successResponse(
      res,

      StatusCodes.OK,

      {
        message: "Marked read",

        data: notification,
      },
    );
  } catch (error) {
    next(error);
  }
};

// delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.Notification.destroy({
      where: {
        id,
      },
    });

    return successResponse(
      res,

      StatusCodes.OK,

      {
        message: "Deleted",
      },
    );
  } catch (error) {
    next(error);
  }
};

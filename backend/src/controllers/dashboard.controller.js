import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "../config/index.js";
import { Op } from "sequelize";

// client review dashboard
export const getClientReviewDashboard = async (req, res, next) => {
  try {
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

    const userId = req.user.id;

    // check client
    const client = await db.User.findOne({
      where: {
        id: userId,
        role: "client",
      },
    });

    if (!client) {
      throw ApiError.FORBIDDEN("Only clients can access this dashboard");
    }

    // total reviews
    const totalReviews = await db.Feedback.count({
      where: {
        receiverId: userId,
      },
    });

    const totalJobs = await db.Job.count({
      where: {
        clientId: userId,
      },
    });

    const totalBids = await db.Bid.count({
      where: {
        clientId: userId,
      },
    });

    // paginated reviews
    const reviews = await db.Feedback.findAll({
      where: {
        receiverId: userId,
      },

      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "role"],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    // all reviews for stats
    const allReviews = await db.Feedback.findAll({
      where: {
        receiverId: userId,
      },

      attributes: ["rating"],
    });

    const totalRatings = allReviews.reduce(
      (acc, item) => acc + Number(item.rating),
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number(totalRatings / totalReviews).toFixed(1) : 0;

    // rating breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allReviews.forEach((review) => {
      ratingBreakdown[review.rating]++;
    });

    // percentages
    const ratingPercentages = {
      5:
        totalReviews > 0
          ? Math.round((ratingBreakdown[5] / totalReviews) * 100)
          : 0,

      4:
        totalReviews > 0
          ? Math.round((ratingBreakdown[4] / totalReviews) * 100)
          : 0,

      3:
        totalReviews > 0
          ? Math.round((ratingBreakdown[3] / totalReviews) * 100)
          : 0,

      2:
        totalReviews > 0
          ? Math.round((ratingBreakdown[2] / totalReviews) * 100)
          : 0,

      1:
        totalReviews > 0
          ? Math.round((ratingBreakdown[1] / totalReviews) * 100)
          : 0,
    };

    return successResponse(res, StatusCodes.OK, {
      message: "Client review dashboard fetched successfully",

      data: {
        role: "client",

        stats: {
          averageRating,
          totalReviews,
          totalJobs,
          totalBids,
          ratingBreakdown,
          ratingPercentages,
        },

        reviews,

        pagination: {
          total: totalReviews,
          page,
          limit,
          totalPages: Math.ceil(totalReviews / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// freelancer review dashboard
export const getFreelancerReviewDashboard = async (req, res, next) => {
  try {
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

    const userId = req.user.id;

    // check freelancer
    const freelancer = await db.User.findOne({
      where: {
        id: userId,
        role: "freelancer",
      },
    });

    if (!freelancer) {
      throw ApiError.FORBIDDEN("Only freelancers can access this dashboard");
    }

    // total reviews
    const totalReviews = await db.Feedback.count({
      where: {
        receiverId: userId,
      },
    });

    const totalBids = await db.Bid.count({
      where: {
        freelancerId: userId,
      },
    });

    const acceptedBids = await db.Bid.count({
      where: {
        freelancerId: userId,
        status: "accepted",
      },
    });

    const rejectedBids = await db.Bid.count({
      where: {
        freelancerId: userId,
        status: "rejected",
      },
    });

    const pendingBids = await db.Bid.count({
      where: {
        freelancerId: userId,
        status: "pending",
      },
    });

    // paginated reviews
    const reviews = await db.Feedback.findAll({
      where: {
        receiverId: userId,
      },

      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "role"],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    // all reviews for stats
    const allReviews = await db.Feedback.findAll({
      where: {
        receiverId: userId,
      },

      attributes: ["rating"],
    });

    const totalRatings = allReviews.reduce(
      (acc, item) => acc + Number(item.rating),
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number(totalRatings / totalReviews).toFixed(1) : 0;

    // breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allReviews.forEach((review) => {
      ratingBreakdown[review.rating]++;
    });

    // percentages
    const ratingPercentages = {
      5:
        totalReviews > 0
          ? Math.round((ratingBreakdown[5] / totalReviews) * 100)
          : 0,

      4:
        totalReviews > 0
          ? Math.round((ratingBreakdown[4] / totalReviews) * 100)
          : 0,

      3:
        totalReviews > 0
          ? Math.round((ratingBreakdown[3] / totalReviews) * 100)
          : 0,

      2:
        totalReviews > 0
          ? Math.round((ratingBreakdown[2] / totalReviews) * 100)
          : 0,

      1:
        totalReviews > 0
          ? Math.round((ratingBreakdown[1] / totalReviews) * 100)
          : 0,
    };

    return successResponse(res, StatusCodes.OK, {
      message: "Freelancer review dashboard fetched successfully",

      data: {
        role: "freelancer",

        stats: {
          averageRating,
          totalReviews,
          totalBids,
          acceptedBids,
          rejectedBids,
          pendingBids,
          ratingBreakdown,
          ratingPercentages,
        },

        reviews,

        pagination: {
          total: totalReviews,
          page,

          limit,
          totalPages: Math.ceil(totalReviews / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// get review dashboard
export const getReviewDashboard = async (req, res, next) => {
  try {
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

    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      throw ApiError.NOTFOUND("User not found");
    }

    // total reviews
    const totalReviews = await db.Feedback.count({
      where: {
        receiverId: user.id,
      },
    });

    // paginated reviews
    const reviews = await db.Feedback.findAll({
      where: {
        receiverId: user.id,
      },

      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "profilePic", "role"],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    // all reviews for stats
    const allReviews = await db.Feedback.findAll({
      where: {
        receiverId: user.id,
      },

      attributes: ["rating"],
    });

    const totalRatings = allReviews.reduce(
      (acc, item) => acc + Number(item.rating),
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number(totalRatings / totalReviews).toFixed(1) : 0;

    // breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allReviews.forEach((review) => {
      ratingBreakdown[review.rating]++;
    });

    // percentages
    const ratingPercentages = {
      5:
        totalReviews > 0
          ? Math.round((ratingBreakdown[5] / totalReviews) * 100)
          : 0,

      4:
        totalReviews > 0
          ? Math.round((ratingBreakdown[4] / totalReviews) * 100)
          : 0,

      3:
        totalReviews > 0
          ? Math.round((ratingBreakdown[3] / totalReviews) * 100)
          : 0,

      2:
        totalReviews > 0
          ? Math.round((ratingBreakdown[2] / totalReviews) * 100)
          : 0,

      1:
        totalReviews > 0
          ? Math.round((ratingBreakdown[1] / totalReviews) * 100)
          : 0,
    };

    return successResponse(res, StatusCodes.OK, {
      message: `${user.role} review dashboard fetched successfully`,

      data: {
        role: user.role,

        stats: {
          averageRating,
          totalReviews,
          ratingBreakdown,
          ratingPercentages,
        },

        reviews,

        pagination: {
          total: totalReviews,
          page,
          limit,
          totalPages: Math.ceil(totalReviews / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// admin freelancers
export const getAdminFreelancers = async (req, res, next) => {
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

    let where = {
      role: "freelancer",
    };

    if (search && search.trim().length > 0) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    const { count, rows } = await db.User.findAndCountAll({
      where,

      attributes: {
        exclude: ["password"],
      },

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Freelancers fetched",

      totalFreelancers: count,

      data: rows,

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

// admin clients
export const getAdminClients = async (req, res, next) => {
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

    let where = {
      role: "client",
    };

    if (search && search.trim().length > 0) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    const { count, rows } = await db.User.findAndCountAll({
      where,

      attributes: {
        exclude: ["password"],
      },

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Clients fetched",

      totalClients: count,

      data: rows,

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

// admin categories
export const getAdminCategories = async (req, res, next) => {
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

    if (search && search.trim().length > 0) {
      where.name = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const { count, rows } = await db.Category.findAndCountAll({
      where,

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Categories fetched",

      totalCategories: count,

      data: rows,

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

// admin jobs
export const getAdminJobs = async (req, res, next) => {
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

    if (search && search.trim().length > 0) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${search.trim()}%`,
          },
        },

        {
          description: {
            [Op.like]: `%${search.trim()}%`,
          },
        },

        {
          level: {
            [Op.like]: `%${search.trim()}%`,
          },
        },

        {
          employment: {
            [Op.like]: `%${search.trim()}%`,
          },
        },

        {
          jobType: {
            [Op.like]: `%${search.trim()}%`,
          },
        },
      ];
    }

    const { count, rows } = await db.Job.findAndCountAll({
      where,

      include: [
        {
          model: db.User,
          as: "client",

          attributes: ["id", "name", "profilePic"],
        },

        {
          model: db.Category,
          as: "category",

          attributes: ["id", "name"],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Jobs fetched",
      totalJobs: count,
      data: rows,

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

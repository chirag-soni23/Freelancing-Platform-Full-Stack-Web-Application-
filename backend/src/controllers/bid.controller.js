import db from "../models/index.js";
import { StatusCodes } from "../config/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

import { Op } from "sequelize";

// create bid
export const createBid = async (req, res, next) => {
  try {
    const freelancerId = req.user.id;

    const { jobId, amount, currency, proposal, deliveryDays } = req.body;

    const job = await db.Job.findByPk(jobId);

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    if (job.clientId === freelancerId) {
      throw ApiError.BADREQUEST("You cannot bid on your own job");
    }

    if (job.status === "closed") {
      throw ApiError.BADREQUEST("Job already closed");
    }

    const existingBid = await db.Bid.findOne({
      where: {
        freelancerId,
        jobId,
      },
    });

    if (existingBid) {
      throw ApiError.BADREQUEST("Already bid submitted");
    }

    const bid = await db.Bid.create({
      amount,
      currency,
      proposal,
      deliveryDays,

      freelancerId,

      clientId: job.clientId,

      jobId,
    });

    // update bid count
    await db.Job.increment("bidCount", {
      by: 1,

      where: {
        id: jobId,
      },
    });

    return successResponse(res, StatusCodes.CREATED, {
      message: "Bid created successfully",

      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

// get my bids
export const getMyBids = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page, 10);

    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
      throw ApiError.BADREQUEST("Page must be a positive integer");
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      throw ApiError.BADREQUEST("Limit must be between 1 and 50");
    }

    const offset = (page - 1) * limit;

    let where = {
      freelancerId: req.user.id,
    };

    const include = [
      {
        model: db.Job,

        as: "job",

        ...(search && search.trim()
          ? {
              where: {
                title: {
                  [Op.like]: `%${search.trim()}%`,
                },
              },
            }
          : {}),
      },

      {
        model: db.User,

        as: "client",

        attributes: ["id", "name", "email", "profilePic"],
      },
    ];

    const { count, rows } = await db.Bid.findAndCountAll({
      where,

      include,

      limit,

      offset,

      order: [["createdAt", "DESC"]],

      distinct: true,
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Bids fetched",

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

// get job bids
export const getJobBids = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await db.Job.findByPk(jobId);

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    if (job.clientId !== req.user.id) {
      throw ApiError.UNAUTHORIZED("Unauthorized");
    }

    const bids = await db.Bid.findAll({
      where: {
        jobId,
      },

      include: [
        {
          model: db.User,

          as: "freelancer",

          attributes: ["id", "name", "profilePic", "title"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

// accept bid
export const acceptBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const bid = await db.Bid.findByPk(bidId);

    if (!bid) {
      throw ApiError.NOTFOUND("Bid not found");
    }

    if (bid.clientId !== req.user.id) {
      throw ApiError.UNAUTHORIZED("Unauthorized");
    }

    const alreadyAccepted = await db.Bid.findOne({
      where: {
        jobId: bid.jobId,

        status: "accepted",
      },
    });

    if (alreadyAccepted) {
      throw ApiError.BADREQUEST("Bid already accepted");
    }

    bid.status = "accepted";

    await bid.save();

    await db.Job.update(
      {
        status: "closed",
      },

      {
        where: {
          id: bid.jobId,
        },
      },
    );

    await db.Bid.update(
      {
        status: "rejected",
      },

      {
        where: {
          jobId: bid.jobId,

          id: {
            [Op.ne]: bid.id,
          },
        },
      },
    );

    let conversation = await db.Conversation.findOne({
      where: {
        [Op.or]: [
          {
            senderId: bid.clientId,

            receiverId: bid.freelancerId,
          },

          {
            senderId: bid.freelancerId,

            receiverId: bid.clientId,
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await db.Conversation.create({
        senderId: bid.clientId,

        receiverId: bid.freelancerId,
      });
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Bid accepted",

      data: {
        bid,
        conversation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// reject bid
export const rejectBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const bid = await db.Bid.findByPk(bidId);

    if (!bid) {
      throw ApiError.NOTFOUND("Bid not found");
    }

    if (bid.clientId !== req.user.id) {
      throw ApiError.UNAUTHORIZED("Unauthorized");
    }

    bid.status = "rejected";

    await bid.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Bid rejected",

      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

// update bid
export const updateBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const { amount, currency, proposal, deliveryDays } = req.body;

    const bid = await db.Bid.findOne({
      where: {
        id: bidId,

        freelancerId: req.user.id,
      },
    });

    if (!bid) {
      throw ApiError.NOTFOUND("Bid not found");
    }

    if (bid.status === "accepted") {
      throw ApiError.BADREQUEST("Accepted bid cannot be edited");
    }

    if (bid.status === "rejected") {
      throw ApiError.BADREQUEST("Rejected bid cannot be edited");
    }

    await bid.update({
      amount: amount ?? bid.amount,

      currency: currency ?? bid.currency,

      proposal: proposal ?? bid.proposal,

      deliveryDays: deliveryDays ?? bid.deliveryDays,
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Bid updated successfully",

      data: bid,
    });
  } catch (error) {
    next(error);
  }
};

// delete bid
export const deleteBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const bid = await db.Bid.findOne({
      where: {
        id: bidId,

        freelancerId: req.user.id,
      },
    });

    if (!bid) {
      throw ApiError.NOTFOUND("Bid not found");
    }

    if (bid.status === "accepted" || bid.status === "rejected") {
      throw ApiError.BADREQUEST("Bid cannot be deleted");
    }

    await db.Job.decrement("bidCount", {
      by: 1,

      where: {
        id: bid.jobId,

        bidCount: {
          [Op.gt]: 0,
        },
      },
    });

    await bid.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Bid deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import db from "../models/index.js";
import { StatusCodes } from "../config/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import { Op } from "sequelize";

// create bid
export const createBid = async (req, res, next) => {
  try {
    const freelancerId = req.user.id;

    const { jobId, amount, proposal, deliveryDays } = req.body;

    const job = await db.Job.findByPk(jobId);

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    // prevent duplicate bid
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
      proposal,
      deliveryDays,

      freelancerId,

      clientId: job.clientId,

      jobId,
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
    const bids = await db.Bid.findAll({
      where: {
        freelancerId: req.user.id,
      },

      include: [
        {
          model: db.Job,
          as: "job",
        },

        {
          model: db.User,
          as: "client",

          attributes: ["id", "name", "profilePic"],
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

// get job bids
export const getJobBids = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await db.Job.findByPk(jobId);

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    // only owner client
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

    bid.status = "accepted";

    await bid.save();

    // reject others
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

    // create chat
    let conversation = await db.Conversation.findOne({
      where: {
        senderId: bid.clientId,

        receiverId: bid.freelancerId,
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

    await bid.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Bid deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

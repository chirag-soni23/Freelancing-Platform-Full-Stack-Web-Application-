import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "../config/index.js";

// create submission
export const createSubmission = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const { submissionUrl } = req.body;

    const bid = await db.Bid.findOne({
      where: {
        id: bidId,
        freelancerId: req.user.id,
        status: "accepted",
      },
    });

    if (!bid) {
      throw ApiError.NOTFOUND("Accepted bid not found");
    }

    const acceptedDate = new Date(bid.acceptedAt);

    const deadlineDate = new Date(acceptedDate);

    deadlineDate.setDate(deadlineDate.getDate() + bid.deliveryDays);

    if (new Date() > deadlineDate) {
      throw ApiError.BADREQUEST(
        "Delivery deadline has passed. Please place a new bid.",
      );
    }

    const existingSubmission = await db.Submission.findOne({
      where: {
        bidId,
      },
    });

    if (existingSubmission) {
      throw ApiError.BADREQUEST("Submission already exists");
    }

    const submission = await db.Submission.create({
      submissionUrl,

      bidId: bid.id,

      freelancerId: bid.freelancerId,

      clientId: bid.clientId,
    });

    await db.Job.update(
      {
        projectStatus: "submitted",
      },
      {
        where: {
          id: bid.jobId,
        },
      },
    );

    return successResponse(res, StatusCodes.CREATED, {
      message: "Project submitted successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// get submission by bid
export const getSubmissionByBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const submission = await db.Submission.findOne({
      where: {
        bidId,
      },

      include: [
        {
          model: db.User,
          as: "freelancer",
          attributes: ["id", "name", "email"],
        },

        {
          model: db.User,
          as: "client",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!submission) {
      throw ApiError.NOTFOUND("Submission not found");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Submission fetched successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// update submission
export const updateSubmission = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const { submissionUrl } = req.body;

    const submission = await db.Submission.findOne({
      where: {
        bidId,
        freelancerId: req.user.id,
      },
    });

    if (!submission) {
      throw ApiError.NOTFOUND("Submission not found");
    }

    submission.submissionUrl = submissionUrl;

    await submission.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Submission updated successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// delete submission
export const deleteSubmission = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const submission = await db.Submission.findOne({
      where: {
        bidId,
        freelancerId: req.user.id,
      },
    });

    if (!submission) {
      throw ApiError.NOTFOUND("Submission not found");
    }

    await submission.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

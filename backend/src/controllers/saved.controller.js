import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

// toggle saved freelancer
export const toggleSaveFreelancer = async (req, res, next) => {
  try {
    const clientId = req.user.id;

    const { freelancerId } = req.body;

    const freelancer = await db.User.findOne({
      where: {
        id: freelancerId,
        role: "freelancer",
      },
    });

    if (!freelancer) {
      throw ApiError.NOTFOUND("Freelancer not found");
    }

    const existing = await db.SavedFreelancer.findOne({
      where: {
        clientId,
        freelancerId,
      },
    });

    // unsave
    if (existing) {
      await existing.destroy();

      return successResponse(res, 200, {
        message: "Freelancer removed from saved",
        saved: false,
      });
    }

    // save
    await db.SavedFreelancer.create({
      clientId,
      freelancerId,
    });

    return successResponse(res, 200, {
      message: "Freelancer saved",
      saved: true,
    });
  } catch (error) {
    next(error);
  }
};

// toggle saved job
export const toggleSaveJob = async (req, res, next) => {
  try {
    const freelancerId = req.user.id;

    const { jobId } = req.body;

    const job = await db.Job.findByPk(jobId);

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    const existing = await db.SavedJob.findOne({
      where: {
        freelancerId,
        jobId,
      },
    });

    if (existing) {
      await existing.destroy();

      return successResponse(res, 200, {
        message: "Job unsaved",
        saved: false,
      });
    }

    await db.SavedJob.create({
      freelancerId,
      jobId,
    });

    return successResponse(res, 200, {
      message: "Job saved",
      saved: true,
    });
  } catch (error) {
    next(error);
  }
};

// get saved freelancer
export const getSavedFreelancers = async (req, res, next) => {
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

    const { count, rows } = await db.SavedFreelancer.findAndCountAll({
      where: {
        clientId: req.user.id,
      },

      include: [
        {
          model: db.User,
          as: "freelancer",

          attributes: {
            exclude: [
              "password",
              "resetPasswordToken",
              "resetPasswordExpire",
              "emailVerificationToken",
              "emailVerificationExpire",
              "companyName",
              "companyWebsite",
              "requirement",
            ],
          },

          include: [
            {
              model: db.Category,
              as: "categories",
              attributes: ["id", "name"],
            },
          ],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, 200, {
      message: "Saved freelancers fetched",

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

// get saved job
export const getSavedJobs = async (req, res, next) => {
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

    const { count, rows } = await db.SavedJob.findAndCountAll({
      where: {
        freelancerId: req.user.id,
      },

      include: [
        {
          model: db.Job,
          as: "job",

          include: [
            {
              model: db.Category,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],

      limit,
      offset,

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, 200, {
      message: "Saved jobs fetched",

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

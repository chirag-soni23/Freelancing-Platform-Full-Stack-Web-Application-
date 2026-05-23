import { Op } from "sequelize";
import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// create job
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      budget,
      currency,
      skills,
      level,
      employment,
      jobType,
      categoryId,
    } = req.body;

    const clientId = req.user.id;

    const job = await db.Job.create({
      title,
      description,
      budget,
      currency,
      skills,
      level,
      employment,
      jobType,
      categoryId,
      clientId,
    });

    return successResponse(res, StatusCodes.CREATED, {
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status,
      level,
      employment,
      jobType,
      category,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
      throw ApiError.BADREQUEST(
        "Page must be a positive integer"
      );
    }

    if (
      isNaN(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      throw ApiError.BADREQUEST(
        "Limit must be between 1 and 50"
      );
    }

    const offset =
      (page - 1) * limit;

    let where = {};
    let user = null;

    // search
    if (search?.trim()) {
      where.title = {
        [Op.like]:
          `%${search.trim()}%`,
      };
    }

    if (level) {
      where.level = level;
    }

    if (employment) {
      where.employment =
        employment;
    }

    if (jobType) {
      where.jobType =
        jobType;
    }

    if (status) {
      where.status = status;
    }

    let categoryWhere =
      {};

    if (category) {
      categoryWhere.name =
        category;
    }

    // token check
    const token =
      req.cookies?.token;

    if (token) {
      try {
        const decoded =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );

        user =
          await db.User.findByPk(
            decoded.id
          );

        // client apni jobs na dekhe
        if (
          user?.role ===
          "client"
        ) {
          where.clientId = {
            [Op.ne]:
              user.id,
          };
        }
      } catch {
        console.log(
          "Invalid token"
        );
      }
    }

    const {
      count,
      rows,
    } =
      await db.Job.findAndCountAll(
        {
          where,

          limit,
          offset,

          include: [
            {
              model:
                db.User,

              as: "client",

              attributes:
                [
                  "id",
                  "name",
                  "profilePic",
                  "isEmailVerified",
                  "createdAt",
                ],
            },

            {
              model:
                db.Bid,

              as: "bids",

              required:
                false,

              attributes:
                [
                  "id",
                  "status",
                  "freelancerId",
                ],
            },

            {
              model:
                db.Category,

              as: "category",

              attributes:
                [
                  "id",
                  "name",
                ],

              where:
                categoryWhere,
            },
          ],

          distinct: true,

          order: [
            [
              "createdAt",
              "DESC",
            ],
          ],
        }
      );

    const jobs = rows.map(
      (job) => {
        const myBid =
          user?.role ===
          "freelancer"
            ? job.bids?.find(
                (
                  bid
                ) =>
                  bid.freelancerId ===
                  user.id
              ) ||
              null
            : null;

        const jobData =
          job.toJSON();

        delete jobData.bids;

        return {
          ...jobData,
          myBid,
        };
      }
    );

    return successResponse(
      res,
      StatusCodes.OK,
      {
        message:
          "Jobs fetched successfully",

        data: jobs,

        pagination: {
          total: count,
          page,
          limit,

          totalPages:
            Math.ceil(
              count /
                limit
            ),
        },
      }
    );
  } catch (error) {
    console.log(
      error.message
    );

    next(error);
  }
};
// get my jobs
export const getMyJobs = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status,
      level,
      employment,
      jobType,
    } = req.query;

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
      clientId: req.user.id,
    };

    // search filter
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

    if (level) {
      where.level = level;
    }

    if (employment) {
      where.employment = employment;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    // status filter
    if (status) {
      where.status = status;
    }

    const { count, rows } = await db.Job.findAndCountAll({
      where,
      limit,
      offset,

      include: [
        {
          model: db.User,
          as: "client",

          attributes: [
            "id",
            "name",
            "profilePic",
            "isEmailVerified",
            "createdAt",
          ],
        },

        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "My jobs fetched successfully",
      data: rows,

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

// get job by id
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await db.Job.findOne({
      where: {
        id,
      },

      include: [
        {
          model: db.User,
          as: "client",

          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "role",
            "profilePic",
            "address",
            "companyName",
            "companyWebsite",
            "isEmailVerified",
            "createdAt",
          ],
        },
      ],
    });

    if (!job) {
      throw ApiError.NOTFOUND("Job not found!");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// update job
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await db.Job.findOne({
      where: { id, clientId: req.user.id },
    });

    if (!job) {
      throw ApiError.NOTFOUND("Job not found");
    }

    const {
      title,
      description,
      budget,
      currency,
      skills,
      level,
      employment,
      jobType,
      categoryId,
      status,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (budget) job.budget = budget;
    if (currency) job.currency = currency;
    if (skills) job.skills = skills;
    if (level) job.level = level;
    if (employment) job.employment = employment;
    if (jobType) job.jobType = jobType;
    if (categoryId) job.categoryId = categoryId;
    if (status) job.status = status;

    await job.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// delete job
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await db.Job.findOne({
      where: { id, clientId: req.user.id },
    });

    if (!job) {
      throw ApiError.NOTFOUND("Job not found!");
    }

    await job.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// toggle job status
export const toggleJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await db.Job.findOne({
      where: { id, clientId: req.user.id },
    });

    if (!job) {
      throw ApiError.NOTFOUND("Job not found!");
    }

    // toggle logic
    job.status = job.status === "open" ? "closed" : "open";

    await job.save();

    return successResponse(res, StatusCodes.OK, {
      message: `Job ${job.status} successfully`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

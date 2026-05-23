import { Op, fn, col, where as sequelizeWhere } from "sequelize";
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
    let {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      hourlyRate = "",
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const offset = (page - 1) * limit;

    let freelancerWhere = {
      role: "freelancer",

      // khud ka profile hide
      id: {
        [Op.ne]: req.user.id,
      },
    };

    // search
    if (search?.trim()) {
      const keyword = search.trim();

      freelancerWhere[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },

        {
          title: {
            [Op.like]: `%${keyword}%`,
          },
        },

        {
          bio: {
            [Op.like]: `%${keyword}%`,
          },
        },

        sequelizeWhere(
          fn("JSON_SEARCH", col("freelancer.skills"), "one", keyword),
          {
            [Op.ne]: null,
          },
        ),
      ];
    }

    // category
    if (category?.trim()) {
      freelancerWhere.categoryId = Number(category);
    }

    // hourly rate
    if (hourlyRate === "0-500") {
      freelancerWhere.hourlyRate = {
        [Op.between]: [0, 500],
      };
    }

    if (hourlyRate === "500-1000") {
      freelancerWhere.hourlyRate = {
        [Op.between]: [500, 1000],
      };
    }

    if (hourlyRate === "1000-5000") {
      freelancerWhere.hourlyRate = {
        [Op.between]: [1000, 5000],
      };
    }

    if (hourlyRate === "5000+") {
      freelancerWhere.hourlyRate = {
        [Op.gte]: 5000,
      };
    }

    const { count, rows } = await db.SavedFreelancer.findAndCountAll({
      where: {
        clientId: req.user.id,
      },

      include: [
        {
          model: db.User,

          as: "freelancer",

          where: freelancerWhere,

          attributes: {
            exclude: [
              "password",
              "resetPasswordToken",
              "resetPasswordExpire",
              "emailVerificationToken",
              "emailVerificationExpire",
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

      distinct: true,

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
    let {
      page = 1,
      limit = 10,
      search = "",
      level,
      employment,
      jobType,
      category,
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

    let jobWhere = {};

    // search
    if (search?.trim()) {
      jobWhere[Op.or] = [
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
      ];
    }

    // filters
    if (level) {
      jobWhere.level = level;
    }

    if (employment) {
      jobWhere.employment = employment;
    }

    if (jobType) {
      jobWhere.jobType = jobType;
    }

    let categoryWhere = {};

    if (category) {
      categoryWhere.name = category;
    }

    const { count, rows } = await db.SavedJob.findAndCountAll({
      where: {
        freelancerId: req.user.id,
      },

      include: [
        {
          model: db.Job,
          as: "job",
          where: jobWhere,

          include: [
            {
              model: db.Category,
              as: "category",
              attributes: ["id", "name"],
              where: categoryWhere,
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

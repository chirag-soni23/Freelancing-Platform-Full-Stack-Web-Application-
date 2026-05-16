import { Op } from "sequelize";
import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

// create category
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const exists = await db.Category.findOne({
      where: { name, userId },
    });

    if (exists) {
      throw ApiError.CONFLICT("category already exists!");
    }

    const category = await db.Category.create({ name, userId });

    return successResponse(res, StatusCodes.OK, {
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// get category
export const getCategories = async (req, res, next) => {
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
      userId: req.user.id,
    };

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

// get category by id
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await db.Category.findOne({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      throw ApiError.NOTFOUND("Category not found!");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Category Fetched Successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// get all unique categories
export const getAllUniqueCategories = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    let where = {};

    if (search && search.trim().length > 0) {
      where.name = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const categories = await db.Category.findAll({
      where,

      attributes: [
        "name",
        [db.connection.fn("MIN", db.connection.col("id")), "id"],
      ],

      group: ["name"],

      order: [["name", "ASC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Unique categories fetched successfully",

      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// update category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await db.Category.findOne({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      throw ApiError.NOTFOUND("Category not found");
    }

    if (name) {
      const exist = await db.Category.findOne({
        where: { name, userId: req.user.id },
      });

      if (exist && exist.id !== category.id) {
        throw ApiError.CONFLICT("Category name already exists");
      }

      category.name = name;
    }

    await category.save();

    return successResponse(res, StatusCodes.OK, {
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// delete category by id
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await db.Category.findOne({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      throw ApiError.NOTFOUND("Category not found!");
    }

    await category.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Category deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

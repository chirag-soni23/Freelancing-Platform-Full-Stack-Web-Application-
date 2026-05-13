import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

import { emailQueue } from "../queue/emailQueue.js";
import contactAdminTemplate from "../templates/contactAdminTemplate.js";
import contactUserTemplate from "../templates/contactUserTemplate.js";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

// create contact
export const createContact = async (req, res, next) => {
  try {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      throw ApiError.BADREQUEST("All fields are required");
    }

    const contact = await db.Contact.create({
      name,
      email,
      description,
    });

    // send mail to admin
    await emailQueue.add("sendEmail", {
      to: process.env.EMAIL_USER,

      subject: "New Contact Inquiry",

      html: contactAdminTemplate({
        name,
        email,
        description,
      }),
    });

    // auto reply user
    await emailQueue.add("sendEmail", {
      to: email,

      subject: "We received your message",

      html: contactUserTemplate({
        name,
        description,
      }),
    });

    return successResponse(res, StatusCodes.CREATED, {
      message: "Contact submitted successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// get all contacts
// get all contacts
export const getAllContacts = async (req, res, next) => {
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

    let where = {};

    // search by name or email
    if (search && search.trim().length > 0) {
      where = {
        [Op.or]: [
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
        ],
      };
    }

    const { count, rows } = await db.Contact.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Contacts fetched successfully",
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

// delete contact
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await db.Contact.findByPk(id);

    if (!contact) {
      throw ApiError.NOTFOUND("Contact not found");
    }

    await contact.destroy();

    return successResponse(res, StatusCodes.OK, {
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

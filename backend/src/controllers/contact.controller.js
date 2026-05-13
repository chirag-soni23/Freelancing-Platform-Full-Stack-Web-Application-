import { StatusCodes } from "../config/index.js";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";

import { emailQueue } from "../queue/emailQueue.js";
import contactAdminTemplate from "../templates/contactAdminTemplate.js";
import contactUserTemplate from "../templates/contactUserTemplate.js";
import dotenv from "dotenv";

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
    await emailQueue.add(
      "sendEmail",
      {
        to: process.env.EMAIL_USER,

        subject: "New Contact Inquiry",

        html: contactAdminTemplate({
          name,
          email,
          description,
        }),
      },
    );

    // auto reply user
    await emailQueue.add(
      "sendEmail",
      {
        to: email,

        subject: "We received your message",

        html: contactUserTemplate({
          name,
          description,
        }),
      },
    );

    return successResponse(res, StatusCodes.CREATED, {
      message: "Contact submitted successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// get all contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await db.Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// get contact by id
export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await db.Contact.findByPk(id);

    if (!contact) {
      throw ApiError.NOTFOUND("Contact not found");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Contact fetched successfully",
      data: contact,
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

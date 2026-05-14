import Joi from "joi";

export const createFeedbackSchema = Joi.object({
  receiverId: Joi.number().integer().required().messages({
    "number.base": "Receiver id must be a number",
    "any.required": "Receiver id is required",
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Please give at least 1 star",
    "number.max": "Rating cannot exceed 5 stars",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(3).max(500).required().messages({
    "string.empty": "Comment is required",
    "string.min": "Comment must be at least 3 characters",
    "string.max": "Comment cannot exceed 500 characters",
    "any.required": "Comment is required",
  }),
});

export const updateFeedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Please give at least 1 star",
    "number.max": "Rating cannot exceed 5 stars",
  }),

  comment: Joi.string().trim().min(3).max(500).messages({
    "string.min": "Comment must be at least 3 characters",
    "string.max": "Comment cannot exceed 500 characters",
  }),
}).min(1);

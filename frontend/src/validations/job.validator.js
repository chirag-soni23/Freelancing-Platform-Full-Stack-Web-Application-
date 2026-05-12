import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().trim().messages({
    "string.empty": "Job title is required",
    "string.min": "Job title must be at least 3 characters",
    "string.max": "Job title cannot exceed 100 characters",
  }),

  description: Joi.string().min(10).required().trim().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),

  budget: Joi.number().integer().min(1).required().messages({
    "number.base": "Budget must be a number",
    "number.min": "Budget must be at least 1",
    "any.required": "Budget is required",
  }),

  currency: Joi.string().valid("INR", "USD").required().messages({
    "any.only": "Currency must be INR or USD",
    "string.empty": "Currency is required",
  }),

  skills: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required()
    .messages({
      "array.base": "Skills must be an array",
      "array.min": "At least one skill is required",
      "any.required": "Skills are required",
    }),

  status: Joi.string().valid("open", "closed").optional(),
});


export const updateJobSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim(),

  description: Joi.string().min(10).trim(),

  budget: Joi.number().integer().min(1),

  currency: Joi.string().valid("INR", "USD"),

  skills: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .messages({
      "array.min": "At least one skill is required",
    }),

  status: Joi.string().valid("open", "closed"),
}).min(1);
import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),

  description: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 1000 characters",
  }),
});

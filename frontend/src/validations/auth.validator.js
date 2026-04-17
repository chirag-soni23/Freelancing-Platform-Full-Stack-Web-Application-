import Joi from "joi";

export const freelancerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  phone: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone is required",
  }),

  title: Joi.string().min(3).required().messages({
    "string.empty": "Professional title is required",
  }),

  bio: Joi.string().min(20).required().messages({
    "string.empty": "Bio is required",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),

  hourlyRate: Joi.number().min(1).required().messages({
    "number.base": "Hourly rate must be a number",
  }),

  skills: Joi.array()
    .items(
      Joi.string().min(2).max(30).messages({
        "string.base": "Skill must be a string",
        "string.max": "Skill cannot exceed 30 characters",
      }),
    )
    .min(1)
    .optional()
    .messages({
      "array.base": "Skills must be an array",
      "array.min": "At least one skill is required",
    }),

  portfolio: Joi.string().uri().required().messages({
    "string.empty": "Portfolio is required",
    "string.uri": "Invalid portfolio URL",
  }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

export const clientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
  }),

  companyName: Joi.string().min(2).max(100).optional().allow("").messages({
    "string.min": "Company name must be at least 2 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  website: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid website URL",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),

  phone: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone is required",
  }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must have 1 uppercase & 1 special character",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),
});

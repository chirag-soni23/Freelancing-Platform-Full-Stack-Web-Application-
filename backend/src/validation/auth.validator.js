import Joi from "joi";

export const registerClientSchema = Joi.object({
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
    "string.min": "Phone must be at least 10 digits",
  }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 8+ chars, include uppercase & special character",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),

  companyName: Joi.string().min(2).max(100).optional().allow("").messages({
    "string.min": "Company name must be at least 2 characters",
  }),

  companyWebsite: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid website URL",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
});

export const registerFreelancerSchema = Joi.object({
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

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 8+ chars, include uppercase & special character",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),

  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Professional title is required",
  }),

  bio: Joi.string().min(20).required().messages({
    "string.empty": "Bio is required",
    "string.min": "Bio must be at least 20 characters",
  }),

  skills: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one skill is required",
  }),

  hourlyRate: Joi.number().min(1).required().messages({
    "number.base": "Hourly rate must be a number",
    "number.min": "Hourly rate must be greater than 0",
  }),

  currency: Joi.string().valid("INR", "USD").required().messages({
    "any.only": "Currency must be INR or USD",
    "string.empty": "Currency is required",
  }),
  portfolio: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid portfolio URL",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters",
  }),

  phone: Joi.string().min(10).max(15).messages({
    "string.min": "Phone must be at least 10 digits",
  }),

  address: Joi.string().messages({
    "string.empty": "Address cannot be empty",
  }),

  email: Joi.string().email().messages({
    "string.email": "Invalid email",
  }),

  profilePic: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid profile image URL",
  }),

  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters",
  }),

  bio: Joi.string().min(10).messages({
    "string.min": "Bio must be at least 10 characters",
  }),

  skills: Joi.array().items(Joi.string()).messages({
    "array.base": "Skills must be an array",
  }),

  languages: Joi.array().items(Joi.string()).messages({
    "array.base": "language must be an array",
  }),

  hourlyRate: Joi.number().min(1).messages({
    "number.base": "Hourly rate must be a number",
    "number.min": "Hourly rate must be greater than 0",
  }),

  currency: Joi.string().valid("INR", "USD").messages({
    "any.only": "Currency must be INR or USD",
  }),

  portfolio: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid portfolio URL",
  }),

  companyName: Joi.string().min(2).max(100).messages({
    "string.min": "Company name must be at least 2 characters",
  }),

  companyWebsite: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid website URL",
  }),
});

export const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),

  newPassword: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.pattern.base":
        "Password must be 8+ chars, include uppercase & special character",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
    }),
});

export const resetPasswordWithTokenSchema = Joi.object({
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

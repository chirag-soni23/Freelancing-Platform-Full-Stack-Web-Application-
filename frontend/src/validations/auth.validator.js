import Joi from "joi";

// register user
export const registerUserSchema = Joi.object({
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

  role: Joi.string()
    .valid("client", "freelancer", "admin")
    .required()
    .messages({
      "any.only": "Role must be client or freelancer or admin",
      "string.empty": "Role is required",
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

// update freelancer profile
export const freelancerSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters",
  }),

  title: Joi.string().allow("").min(3).messages({
    "string.min": "Professional title must be at least 3 characters",
  }),

  bio: Joi.string().allow("").min(20).messages({
    "string.min": "Bio must be at least 20 characters",
  }),

  address: Joi.string().allow("").messages({
    "string.empty": "Address is required",
  }),

  hourlyRate: Joi.number().allow(null).min(1).messages({
    "number.base": "Hourly rate must be a number",
  }),

  currency: Joi.string().allow("").valid("INR", "USD").messages({
    "any.only": "Currency must be INR or USD",
  }),

  skills: Joi.array()
    .items(
      Joi.string().min(2).max(30).messages({
        "string.base": "Skill must be a string",
        "string.max": "Skill cannot exceed 30 characters",
      }),
    )
    .optional()
    .messages({
      "array.base": "Skills must be an array",
    }),

  languages: Joi.array()
    .items(
      Joi.string().min(2).max(30).messages({
        "string.base": "Language must be a string",
        "string.max": "Language cannot exceed 30 characters",
      }),
    )
    .optional()
    .messages({
      "array.base": "Language must be an array",
    }),

  portfolio: Joi.string().allow("", null).uri().messages({
    "string.uri": "Invalid portfolio URL",
  }),
});

// update client profile
export const clientSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters",
  }),

  companyName: Joi.string().min(2).max(100).optional().allow("").messages({
    "string.min": "Company name must be at least 2 characters",
  }),

  companyWebsite: Joi.string().uri().allow("", null).messages({
    "string.uri": "Invalid website URL",
  }),

  requirement: Joi.string().min(10).max(1000).messages({
    "string.min": "Requirement must be at least 10 characters",
    "string.max": "Requirement cannot exceed 1000 characters",
  }),

  address: Joi.string().messages({
    "string.empty": "Address is required",
  }),
});

// reset password with token
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

// login
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// update profile
export const updateProfileSchema = Joi.object({
  // common
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().messages({
    "string.email": "Invalid email",
  }),

  address: Joi.string().allow("").messages({
    "string.empty": "Address is required",
  }),

  // freelancer
  title: Joi.string().allow("").min(3).max(100).messages({
    "string.min": "Professional title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),

  bio: Joi.string().allow("").min(50).max(1000).messages({
    "string.min": "Bio must be at least 50 characters",
    "string.max": "Bio cannot exceed 1000 characters",
  }),

  hourlyRate: Joi.number().allow(null).min(1).messages({
    "number.base": "Hourly rate must be a number",
    "number.min": "Hourly rate must be greater than 0",
  }),

  currency: Joi.string().allow("").valid("INR", "USD").messages({
    "any.only": "Currency must be INR or USD",
  }),

  categoryId: Joi.number().allow(null).messages({
    "number.base": "Category is required",
  }),

  skills: Joi.array()
    .items(
      Joi.string().min(2).max(30).messages({
        "string.min": "Skill must be at least 2 characters",
        "string.max": "Skill cannot exceed 30 characters",
      }),
    )
    .optional(),

  languages: Joi.array()
    .items(
      Joi.string().min(2).max(30).messages({
        "string.min": "Language must be at least 2 characters",
        "string.max": "Language cannot exceed 30 characters",
      }),
    )
    .optional(),

  portfolio: Joi.string().allow("", null).uri().messages({
    "string.uri": "Invalid portfolio URL",
  }),

  isAvailable: Joi.boolean(),

  // client
  companyName: Joi.string().allow("").min(2).max(100).messages({
    "string.min": "Company name must be at least 2 characters",
  }),

  companyWebsite: Joi.string().allow("", null).uri().messages({
    "string.uri": "Invalid company website URL",
  }),

  requirement: Joi.string().allow("").min(10).max(1000).messages({
    "string.min": "Requirement must be at least 10 characters",
    "string.max": "Requirement cannot exceed 1000 characters",
  }),
});

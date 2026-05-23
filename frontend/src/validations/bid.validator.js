import Joi from "joi";

export const bidSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",

    "number.positive": "Amount must be greater than 0",

    "any.required": "Amount is required",
  }),

  currency: Joi.string().valid("INR", "USD").required().messages({
    "any.only": "Currency must be INR or USD",

    "any.required": "Currency is required",
  }),

  proposal: Joi.string().trim().min(20).max(1000).required().messages({
    "string.empty": "Proposal is required",

    "string.min": "Proposal must be at least 20 characters",

    "string.max": "Proposal cannot exceed 1000 characters",
  }),

  deliveryDays: Joi.number().integer().min(1).required().messages({
    "number.base": "Delivery days must be number",

    "number.min": "Delivery days must be at least 1",

    "any.required": "Delivery days required",
  }),
});

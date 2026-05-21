import Joi from "joi";

// CREATE BID
export const createBidSchema = Joi.object({
  jobId: Joi.number().integer().positive().required().messages({
    "number.base": "Job id must be a number",

    "number.integer": "Job id must be integer",

    "any.required": "Job id is required",
  }),

  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",

    "number.positive": "Amount must be greater than 0",

    "any.required": "Amount is required",
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

// UPDATE BID STATUS
export const updateBidStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "rejected", "withdrawn")
    .required()
    .messages({
      "any.only": "Invalid bid status",

      "any.required": "Status is required",
    }),
});

// DELETE BID
export const deleteBidSchema = Joi.object({
  bidId: Joi.number().integer().positive().required().messages({
    "number.base": "Bid id must be number",

    "any.required": "Bid id required",
  }),
});

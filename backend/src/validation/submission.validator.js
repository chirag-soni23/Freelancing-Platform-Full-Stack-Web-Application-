import Joi from "joi";

// submission schema
export const submissionSchema = Joi.object({
  submissionUrl: Joi.string().uri().required().messages({
    "string.empty": "Submission URL is required",
    "string.uri": "Please provide a valid URL",
  }),
});

// update submission schema
export const updateSubmissionSchema = Joi.object({
  submissionUrl: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Please provide a valid URL",
  }),
});

import rateLimit from "express-rate-limit";

export const verificationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message:
      "You've requested verification links too many times. Email verification has been temporarily blocked for 5 minutes.",
  },

  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

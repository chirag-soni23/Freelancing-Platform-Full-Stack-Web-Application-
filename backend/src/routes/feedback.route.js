import express from "express";
import {
  createFeedback,
  deleteFeedback,
  getUserFeedbacks,
  updateFeedback,
} from "../controllers/feedback.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createFeedbackSchema,
  updateFeedbackSchema,
} from "../validation/feedback.validator.js";

const router = express.Router();

router.post("/", validate(createFeedbackSchema), createFeedback);
router.get("/:userId", getUserFeedbacks);
router.patch("/:id", validate(updateFeedbackSchema), updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;

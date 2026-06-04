import express from "express";
import { checkRole } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  submissionSchema,
  updateSubmissionSchema,
} from "../validation/submission.validator.js";
import {
  createSubmission,
  deleteSubmission,
  getSubmissionByBid,
  updateSubmission,
} from "../controllers/submission.controller.js";

const router = express.Router();

router.post(
  "/:bidId",
  checkRole("freelancer"),
  validate(submissionSchema),
  createSubmission,
);

router.get("/:bidId", getSubmissionByBid);
router.patch(
  "/:bidId",
  checkRole("freelancer"),
  validate(updateSubmissionSchema),
  updateSubmission,
);
router.delete("/:bidId", checkRole("freelancer"), deleteSubmission);

export default router;

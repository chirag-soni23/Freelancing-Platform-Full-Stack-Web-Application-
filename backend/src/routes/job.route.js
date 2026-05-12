import express from "express";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  toggleJobStatus,
  updateJob,
} from "../controllers/job.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validation/job.validator.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuth, checkRole("client"), validate(createJobSchema), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.patch("/:id",isAuth, checkRole("client"), validate(updateJobSchema), updateJob);
router.patch("/toggle-status/:id",isAuth, checkRole("client"), toggleJobStatus);
router.delete("/:id",isAuth, checkRole("client"), deleteJob);

export default router;

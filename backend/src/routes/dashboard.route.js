import express from "express";
import {
  getClientReviewDashboard,
  getFreelancerReviewDashboard,
} from "../controllers/dashboard.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/client-reviews", checkRole("client"), getClientReviewDashboard);
router.get(
  "/freelancer-reviews",
  checkRole("freelancer"),
  getFreelancerReviewDashboard,
);

export default router;

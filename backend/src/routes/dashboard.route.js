import express from "express";
import {
  getAdminCategories,
  getAdminClients,
  getAdminFreelancers,
  getAdminJobs,
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
router.get("/total-freelancer", checkRole("admin"), getAdminFreelancers);
router.get("/total-client", checkRole("admin"), getAdminClients);
router.get("/total-categories", checkRole("admin"), getAdminCategories);
router.get("/total-job", checkRole("admin", "freelancer"), getAdminJobs);
export default router;

import express from "express";
import {
  getSavedFreelancers,
  getSavedJobs,
  toggleSaveFreelancer,
  toggleSaveJob,
} from "../controllers/saved.controller.js";

const router = express.Router();

router.patch("/save-freelancer", toggleSaveFreelancer);
router.get("/saved-freelancers", getSavedFreelancers);
router.patch("/save-job", toggleSaveJob);
router.get("/saved-jobs", getSavedJobs);

export default router;

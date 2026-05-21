import express from "express";

import {
  createBid,
  getMyBids,
  getJobBids,
  acceptBid,
  rejectBid,
  deleteBid,
} from "../controllers/bid.controller.js";

import { checkRole } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createBidSchema } from "../validation/bid.validator.js";

const router = express.Router();

router.post(
  "/create",
  validate(createBidSchema),
  checkRole("freelancer"),
  createBid,
);
router.get("/my", getMyBids);
router.get("/job/:jobId", checkRole("client"), getJobBids);
router.patch("/accept/:bidId", checkRole("client"), acceptBid);
router.patch("/reject/:bidId", checkRole("client"),
 rejectBid);
router.delete("/:bidId", checkRole("freelancer"), deleteBid);

export default router;

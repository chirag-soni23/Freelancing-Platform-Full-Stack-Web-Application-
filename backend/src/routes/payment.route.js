import express from "express";
import {
  createPayment,
  stripeWebhook,
  getPaymentStatus,
  getMyPayments,
} from "../controllers/payment.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create/:bidId", isAuth, checkRole("client"), createPayment);

router.get("/status/:bidId", isAuth, getPaymentStatus);

router.get("/my-payments", isAuth, getMyPayments);

// webhook
router.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook,
);


export default router;

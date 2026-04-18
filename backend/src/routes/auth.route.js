import express from "express";
import validate from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerClientSchema,
  registerFreelancerSchema,
  resetPasswordSchema,
  resetPasswordWithTokenSchema,
  updateProfileSchema,
} from "../validation/auth.validator.js";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  registerClient,
  registerFreelancer,
  resendVerificationEmail,
  resetPassword,
  resetPasswordWithToken,
  updateProfile,
  updateProfilePic,
  uploadProfilePic,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register-client", validate(registerClientSchema), registerClient);
router.post(
  "/register-freelancer",
  validate(registerFreelancerSchema),
  registerFreelancer,
);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuth, getMe);
router.get("/verify-email/:token", isAuth, verifyEmail);
router.patch(
  "/update-profile",
  isAuth,
  validate(updateProfileSchema),
  updateProfile,
);
router.post(
  "/upload-profile-pic",
  isAuth,
  upload.single("profilePic"),
  uploadProfilePic,
);
router.patch(
  "/update-profile-pic",
  isAuth,
  upload.single("profilePic"),
  updateProfilePic,
);
router.post("/logout", isAuth, logout);
router.patch(
  "/reset-password",
  isAuth,
  validate(resetPasswordSchema),
  resetPassword,
);
router.post("/forgot-password", isAuth, forgotPassword);
router.patch(
  "/reset-password/:token",
  validate(resetPasswordWithTokenSchema),
  resetPasswordWithToken,
);
router.post("/resend-verification", isAuth, resendVerificationEmail);

export default router;

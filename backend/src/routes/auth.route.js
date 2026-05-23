import express from "express";
import validate from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
  resetPasswordWithTokenSchema,
} from "../validation/auth.validator.js";
import {
  forgotPassword,
  getAllClients,
  getAllFreelancers,
  getFreelancerById,
  getMe,
  login,
  logout,
  registerUser,
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
import { verificationRateLimit } from "../middlewares/verificationRateLimit.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginSchema), login);
router.get("/me", isAuth, getMe);
router.get("/verify-email/:token", isAuth, verifyEmail);
router.get("/getall-freelancer",getAllFreelancers);
router.get("/getall-client",getAllClients);
router.get("/freelancer/:id",getFreelancerById);
router.patch(
  "/update-profile",
  isAuth,
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
router.post("/forgot-password", forgotPassword);
router.patch(
  "/reset-password/:token",
  validate(resetPasswordWithTokenSchema),
  resetPasswordWithToken,
);
router.post("/resend-verification", isAuth, verificationRateLimit, resendVerificationEmail);

export default router;

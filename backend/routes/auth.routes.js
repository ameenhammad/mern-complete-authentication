import express from "express";
export const router = express.Router();
import {
  signup,
  login,
  forgetPassword,
  verifyOtp,
  resetPassword,
  resendOTP,
} from "../controllers/auth.controller.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOTP);

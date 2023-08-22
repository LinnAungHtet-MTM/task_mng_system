import express from "express";
import {
  changePassword,
  forgetPassword,
  login,
  resetPassword,
  verifyAccount,
} from "../controllers/authController";

const router = express.Router();

router.post("/login", login);

router.post("/change-password", changePassword);

router.post("/forget-password", forgetPassword);

router.post("/reset-password/:id", resetPassword);

router.post("/verify/:token", verifyAccount);

export default router;

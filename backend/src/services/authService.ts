import { NextFunction, Request, Response } from "express";
import userDB from "../models/employeeModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail";

const loginService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email does not exists" });
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Please first verify your email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, type: user.position },
      process.env.JWT_SECRET!,
      { expiresIn: "1D" }
    );
    return res
      .status(200)
      .json({ message: "Logged In successfully!", token, userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err, message: "Failed to login" });
  }
};

const changePasswordService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "This user does not exists!" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password!);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong old password!" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Old Password and new Password must not same!" });
    }

    if (newPassword === confirmPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ message: "Changed Password successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "New Password and confirm password must same!" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to change password" });
  }
};

const forgetPasswordService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await userDB.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "This user does not exists!" });
    }

    const resetPasswordLink = `Hello,\n\n Please click the following link to reset your password: \n\n ${process.env.CLIENT_URL}/reset-password/${user._id}`;
    sendEmail(email, "Reset Password", resetPasswordLink);
    res.status(200).json({ message: "Reset Password Link send to your email" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to forget password" });
  }
};

const resetPasswordService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New Password and confirm password must same!" });
    }
    const user = await userDB.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "This user does not exists!" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Change Password Successfully" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to reset password" });
  }
};

const verifyAccountService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const employeeData = await userDB.findOne({ token });
    if (employeeData) {
      await userDB.findOneAndUpdate(
        { token: employeeData.token },
        {
          verified: true,
          token: null,
        }
      );
      return res.status(200).json({ message: "Account Verified" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to verify account" });
  }
};

export {
  loginService,
  changePasswordService,
  forgetPasswordService,
  resetPasswordService,
  verifyAccountService,
};

import { NextFunction, Request, Response } from "express";
import {
  changePasswordService,
  forgetPasswordService,
  loginService,
  resetPasswordService,
  verifyAccountService,
} from "../services/authService";

const login = async (req: Request, res: Response, next: NextFunction) => {
  loginService(req, res, next);
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  changePasswordService(req, res, next);
};

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  forgetPasswordService(req, res, next);
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  resetPasswordService(req, res, next);
};

const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyAccountService(req, res, next);
};

export { login, changePassword, forgetPassword, resetPassword, verifyAccount };

import { NextFunction, Request, Response } from "express";
import {
  createEmployeeNotiService,
  getAllEmployeeNotiService,
  updateEmployeeNotiService,
} from "../services/notiEmployeeService";

const getAllEmployeeNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAllEmployeeNotiService(req, res, next);
};

const createEmployeeNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createEmployeeNotiService(req, res, next);
};

const updateEmployeeNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateEmployeeNotiService(req, res, next);
};

export { getAllEmployeeNoti, createEmployeeNoti, updateEmployeeNoti };

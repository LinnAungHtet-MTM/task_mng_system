import { NextFunction, Request, Response } from "express";
import {
  getAllTaskNotiService,
  createTaskNotiService,
  updateTaskNotiService,
} from "../services/notiTaskService";

const getAllTaskNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAllTaskNotiService(req, res, next);
};

const createTaskNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createTaskNotiService(req, res, next);
};

const updateTaskNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateTaskNotiService(req, res, next);
};

export { getAllTaskNoti, createTaskNoti, updateTaskNoti };

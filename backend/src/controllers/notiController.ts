import { NextFunction, Request, Response } from "express";
import {
  createNotiService,
  getAllNotificationService,
  updateNotiService,
} from "../services/notiService";

const getAllNoti = async (req: Request, res: Response, next: NextFunction) => {
  getAllNotificationService(req, res, next);
};

const createNoti = async (req: Request, res: Response, next: NextFunction) => {
  createNotiService(req, res, next);
};

const updateNoti = async (req: Request, res: Response, next: NextFunction) => {
  updateNotiService(req, res, next);
};

export { getAllNoti, createNoti, updateNoti };

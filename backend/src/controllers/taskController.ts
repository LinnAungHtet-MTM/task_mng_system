import { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  getAllTaskService,
  getTaskById,
  updateTaskService,
} from "../services/taskService";

const getAllTask = async (req: Request, res: Response, next: NextFunction) => {
  getAllTaskService(req, res, next);
};

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  createTaskService(req, res, next);
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
  getTaskById(req, res, next);
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  updateTaskService(req, res, next);
};

export { getAllTask, createTask, getTask, updateTask };

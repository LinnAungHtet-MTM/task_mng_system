import { NextFunction, Request, Response } from "express";
import {
  createProjectServices,
  dropProjectService,
  getProjectIdService,
  getProjectServices,
  updateProjectService,
} from "../services/projectService";

const getProject = async (req: Request, res: Response, next: NextFunction) => {
  getProjectServices(req, res, next);
};

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createProjectServices(req, res, next);
};

const getProjectId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getProjectIdService(req, res, next);
};

const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateProjectService(req, res, next);
};

const dropProject = async (req: Request, res: Response, next: NextFunction) => {
  dropProjectService(req, res, next);
};

export { getProject, createProject, getProjectId, updateProject, dropProject };

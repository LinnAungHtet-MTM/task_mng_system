import { NextFunction, Request, Response } from "express";
import {
  createReportService,
  dropReportServices,
  getAllReportServices,
} from "../services/reportService";

const getAllReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAllReportServices(req, res, next);
};

const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createReportService(req, res, next);
};

const dropReport = async (req: Request, res: Response, next: NextFunction) => {
  dropReportServices(req, res, next);
};

export { getAllReport, createReport, dropReport };

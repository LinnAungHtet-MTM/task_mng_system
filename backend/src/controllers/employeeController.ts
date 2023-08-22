import { NextFunction, Request, Response } from "express";
import {
  createEmployeeService,
  dropEmployeeService,
  getAllEmployeeServices,
  getEmployeeIdService,
  updateEmployeeService,
} from "../services/employeeService";

const getAllEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getAllEmployeeServices(req, res, next);
};

const getEmployeeId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getEmployeeIdService(req, res, next);
};

const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createEmployeeService(req, res, next);
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateEmployeeService(req, res, next);
};

const dropEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  dropEmployeeService(req, res, next);
};

export {
  getAllEmployee,
  getEmployeeId,
  createEmployee,
  updateEmployee,
  dropEmployee,
};

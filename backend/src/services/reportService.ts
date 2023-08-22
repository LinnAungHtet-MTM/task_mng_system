import { NextFunction, Request, Response } from "express";
import reportDB from "../models/reportModel";

const getAllReportServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportDB.find().populate([
      {
        path: "task_id",
        select: "title project_name",
        populate: {
          path: "project_name",
          select: "projectName",
        },
      },
    ]);
    res
      .status(200)
      .json({ success: true, message: "Gell All Report Lists", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to get all report" });
  }
};

const createReportService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportData = req.body;
    const data = await reportDB.insertMany(reportData);
    res
      .status(201)
      .json({ success: true, message: "New Report Created", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to create report" });
  }
};

const dropReportServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await reportDB.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Report Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to delete report" });
  }
};

export { getAllReportServices, createReportService, dropReportServices };

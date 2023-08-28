import { NextFunction, Request, Response } from "express";
import notiEmployeeDB from "../models/socketEmployee";

const getAllEmployeeNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await notiEmployeeDB.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, message: "All Employee Notification data", data });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Failed to get all notification" });
  }
};

const createEmployeeNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = req.body;
    const data = await notiEmployeeDB.insertMany(notiData);
    res
      .status(201)
      .json({ success: true, message: "New Employee Noti List Created", data });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Failed to create notification" });
  }
};

const updateEmployeeNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = {
      $push: req.body,
    };
    const noti = await notiEmployeeDB.findById(req.params.id);
    if (noti) {
      const data = await notiEmployeeDB.findByIdAndUpdate(noti._id, notiData);
      res
        .status(200)
        .json({ success: true, message: "Noti Updated Successfully", data });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No Notification with this id" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Failed to update notification" });
  }
};

export {
  getAllEmployeeNotiService,
  createEmployeeNotiService,
  updateEmployeeNotiService,
};

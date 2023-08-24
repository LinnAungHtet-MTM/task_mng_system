import { NextFunction, Request, Response } from "express";
import notiTaskDB from "../models/socketTask";

const getAllTaskNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await notiTaskDB.find();
    res
      .status(200)
      .json({ success: true, message: "All Notification data", data });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Failed to get all notification" });
  }
};

const createTaskNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = req.body;
    const data = await notiTaskDB.insertMany(notiData);
    res
      .status(201)
      .json({ success: true, message: "New Noti List Created", data });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: "Failed to create notification" });
  }
};

const updateTaskNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = {
      $push: req.body,
    };
    const noti = await notiTaskDB.findById(req.params.id);
    if (noti) {
      const data = await notiTaskDB.findByIdAndUpdate(noti._id, notiData);
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

export { getAllTaskNotiService, createTaskNotiService, updateTaskNotiService };

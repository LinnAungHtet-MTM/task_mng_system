import { NextFunction, Request, Response } from "express";
import notiDB from "../models/socketModel";

const getAllNotificationService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await notiDB.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, message: "All Notification data", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to get all notification" });
  }
};

const createNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = req.body;
    const data = await notiDB.insertMany(notiData);
    res
      .status(201)
      .json({ success: true, message: "New Noti List Created", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to create notification" });;
  }
};

const updateNotiService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notiData = req.body;
    const noti = await notiDB.findById(req.params.id);
    if (noti) {
      const data = await notiDB.findByIdAndUpdate(noti._id, notiData);
      res
        .status(200)
        .json({ success: true, message: "Noti Updated Successfully", data });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No Notification with this id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to update notification" });
  }
};

export { getAllNotificationService, createNotiService, updateNotiService };

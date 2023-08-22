import { NextFunction, Request, Response } from "express";
import taskDB from "../models/taskModel";

const getAllTaskService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await taskDB.find().populate([
      {
        path: "project_name",
        select: "_id projectName",
      },
      {
        path: "assigned_employee",
        select: "_id employeeName",
      },
    ]);
    res.status(200).json({ success: true, message: "All Task List", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to get all task" });
  }
};

const createTaskService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskData = {
      ...req.body,
    };
    const data = await new taskDB(taskData).save();
    res.status(201).json({ success: true, message: "New Task Added", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to create task" });
  }
};

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskDB.findById(req.params.id).populate([
      { path: "project_name", select: "_id projectName" },
      { path: "assigned_employee", select: "_id employeeName" },
    ]);
    if (task) {
      res
        .status(200)
        .json({ success: true, message: "Get Task by id", data: task });
    } else {
      res.json({ success: false, message: "No Task with this id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Task not found" });
  }
};

const updateTaskService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskData = {
      ...req.body,
    };
    const task = await taskDB.findById(req.params.id);
    if (task) {
      await taskDB.findByIdAndUpdate(task._id, taskData);
      const updateTask = await taskDB.find(task._id).populate([
        { path: "project_name", select: "_id projectName" },
        { path: "assigned_employee", select: "_id employeeName" },
      ]);
      res.status(200).json({
        success: true,
        message: "Task Updated Successfully",
        data: updateTask,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to update task" });
  }
};

export { getAllTaskService, createTaskService, getTaskById, updateTaskService };

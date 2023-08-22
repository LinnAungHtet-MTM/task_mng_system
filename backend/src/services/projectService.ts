import { NextFunction, Request, Response } from "express";
import projectDB from "../models/projectModel";
import dayjs from "dayjs";

const getProjectServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await projectDB.find();
    res.status(200).json({ success: true, message: "All Projects", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to get all project" });
  }
};

const createProjectServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectData = {
      projectName: req.body.projectName,
      language: req.body.language,
      description: req.body.description,
      startDate: dayjs(req.body.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(req.body.endDate).format("YYYY-MM-DD"),
    };
    const data = await new projectDB(projectData).save();
    res
      .status(201)
      .json({ success: true, message: "New Project Created", data });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to create project" });
  }
};

const getProjectIdService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await projectDB.findById(req.params.id);
    if (data) {
      return res
        .status(201)
        .json({ success: true, message: "Get single project by id", data });
    } else {
      res.json({ success: false, message: "No project with this id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Project not found" });
  }
};

const updateProjectService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectData = {
      projectName: req.body.projectName,
      language: req.body.language,
      description: req.body.description,
      startDate: dayjs(req.body.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(req.body.endDate).format("YYYY-MM-DD"),
    };
    const data = await projectDB.findById(req.params.id);
    if (data) {
      await projectDB.findByIdAndUpdate(data._id, projectData);
      const updateProject = await projectDB.findById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Project Updated Successfully",
        data: updateProject,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to update project" });
  }
};

const dropProjectService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await projectDB.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Project Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed to delete project" });
  }
};

export {
  getProjectServices,
  createProjectServices,
  getProjectIdService,
  updateProjectService,
  dropProjectService,
};

import express from "express";
import {
  createProject,
  dropProject,
  getProject,
  getProjectId,
  updateProject,
} from "../controllers/projectController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/list", [verifyToken, getProject]);

router.get("/:id", [verifyToken, getProjectId]);

router.post("/add", [verifyToken, createProject]);

router.put("/edit/:id", [verifyToken, updateProject]);

router.delete("/delete/:id", [verifyToken, dropProject]);

export default router;

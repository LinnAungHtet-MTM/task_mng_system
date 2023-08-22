import express from "express";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
} from "../controllers/taskController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/list", [verifyToken, getAllTask]);

router.post("/add", [verifyToken, createTask]);

router.get("/:id", [verifyToken, getTask]);

router.put("/edit/:id", [verifyToken, updateTask]);
export default router;

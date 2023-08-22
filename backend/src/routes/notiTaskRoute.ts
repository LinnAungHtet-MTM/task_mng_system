import express from "express";
import {
  createTaskNoti,
  getAllTaskNoti,
  updateTaskNoti,
} from "../controllers/notiTaskController";

const router = express.Router();

router.get("/list", getAllTaskNoti);

router.post("/add", createTaskNoti);

router.put("/edit/:id", updateTaskNoti);

export default router;

import express from "express";
import {
  createEmployeeNoti,
  getAllEmployeeNoti,
  updateEmployeeNoti,
} from "../controllers/notiEmployeeController";

const router = express.Router();

router.get("/list", getAllEmployeeNoti);

router.post("/add", createEmployeeNoti);

router.put("/edit/:id", updateEmployeeNoti);

export default router;

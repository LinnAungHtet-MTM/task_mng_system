import express from "express";
import {
  createNoti,
  getAllNoti,
  updateNoti,
} from "../controllers/notiController";

const router = express.Router();

router.get("/list", getAllNoti);

router.post("/add", createNoti);

router.put("/edit/:id", updateNoti);

export default router;

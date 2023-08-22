import express from "express";
import {
  createReport,
  dropReport,
  getAllReport,
} from "../controllers/reportController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/list", [verifyToken,getAllReport]);

router.post("/add", [verifyToken,createReport]);

router.delete("/delete/:id", [verifyToken,dropReport]);

export default router;

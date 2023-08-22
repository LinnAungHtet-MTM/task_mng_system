import express from "express";
import {
  createEmployee,
  dropEmployee,
  getAllEmployee,
  getEmployeeId,
  updateEmployee,
} from "../controllers/employeeController";
import multer from "multer";
import verifyToken from "../middleware/verifyToken";
const upload = multer({
  storage: multer.diskStorage({}),
});

const router = express.Router();

router.get("/list", [verifyToken, getAllEmployee]);

router.get("/:id", [verifyToken, getEmployeeId]);

router.post("/add", [upload.single("profile"), verifyToken, createEmployee]);

router.put("/edit/:id", [
  upload.single("profile"),
  verifyToken,
  updateEmployee,
]);

router.delete("/delete/:id", [verifyToken, dropEmployee]);

export default router;

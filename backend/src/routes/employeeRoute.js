"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const multer_1 = require("multer");
const verifyToken_1 = require("../middleware/verifyToken");
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
});
const router = express_1.default.Router();
router.get("/list", [verifyToken_1.default, employeeController_1.getAllEmployee]);
router.get("/:id", [verifyToken_1.default, employeeController_1.getEmployeeId]);
router.post("/add", [upload.single("profile"), verifyToken_1.default, employeeController_1.createEmployee]);
router.put("/edit/:id", [
    upload.single("profile"),
    verifyToken_1.default,
    employeeController_1.updateEmployee,
]);
router.delete("/delete/:id", [verifyToken_1.default, employeeController_1.dropEmployee]);
exports.default = router;

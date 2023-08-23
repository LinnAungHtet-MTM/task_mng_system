"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportController_1 = require("../controllers/reportController");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
router.get("/list", [verifyToken_1.default, reportController_1.getAllReport]);
router.post("/add", [verifyToken_1.default, reportController_1.createReport]);
router.delete("/delete/:id", [verifyToken_1.default, reportController_1.dropReport]);
exports.default = router;

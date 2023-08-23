"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
router.get("/list", [verifyToken_1.default, taskController_1.getAllTask]);
router.post("/add", [verifyToken_1.default, taskController_1.createTask]);
router.get("/:id", [verifyToken_1.default, taskController_1.getTask]);
router.put("/edit/:id", [verifyToken_1.default, taskController_1.updateTask]);
exports.default = router;

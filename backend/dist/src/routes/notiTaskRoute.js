"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notiTaskController_1 = require("../controllers/notiTaskController");
const router = express_1.default.Router();
router.get("/list", notiTaskController_1.getAllTaskNoti);
router.post("/add", notiTaskController_1.createTaskNoti);
router.put("/edit/:id", notiTaskController_1.updateTaskNoti);
exports.default = router;

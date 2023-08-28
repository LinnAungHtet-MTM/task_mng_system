"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notiEmployeeController_1 = require("../controllers/notiEmployeeController");
const router = express_1.default.Router();
router.get("/list", notiEmployeeController_1.getAllEmployeeNoti);
router.post("/add", notiEmployeeController_1.createEmployeeNoti);
router.put("/edit/:id", notiEmployeeController_1.updateEmployeeNoti);
exports.default = router;

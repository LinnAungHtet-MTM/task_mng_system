"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/login", authController_1.login);
router.post("/change-password", authController_1.changePassword);
router.post("/forget-password", authController_1.forgetPassword);
router.post("/reset-password/:id", authController_1.resetPassword);
router.post("/verify/:token", authController_1.verifyAccount);
exports.default = router;

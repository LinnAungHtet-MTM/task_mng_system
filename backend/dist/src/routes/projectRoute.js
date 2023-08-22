"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = express_1.default.Router();
router.get("/list", [verifyToken_1.default, projectController_1.getProject]);
router.get("/:id", [verifyToken_1.default, projectController_1.getProjectId]);
router.post("/add", [verifyToken_1.default, projectController_1.createProject]);
router.put("/edit/:id", [verifyToken_1.default, projectController_1.updateProject]);
router.delete("/delete/:id", [verifyToken_1.default, projectController_1.dropProject]);
exports.default = router;
//# sourceMappingURL=projectRoute.js.map
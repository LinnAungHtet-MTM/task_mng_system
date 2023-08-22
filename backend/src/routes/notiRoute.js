"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notiController_1 = require("../controllers/notiController");
const router = express_1.default.Router();
router.get("/list", notiController_1.getAllNoti);
router.post("/add", notiController_1.createNoti);
router.put("/edit/:id", notiController_1.updateNoti);
exports.default = router;

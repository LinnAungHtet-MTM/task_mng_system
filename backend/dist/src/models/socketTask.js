"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskNotiSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    assignEmployeeId: { type: String, required: true },
    profile: { type: String, required: true },
    read: { type: Array, default: [] },
    userId: { type: String, required: true },
    status: { type: String, default: "task" },
    taskCreated: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("taskNotification", taskNotiSchema);

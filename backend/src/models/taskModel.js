"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    project_name: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "project" },
    assigned_employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "employee",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    estimate_hour: { type: Number, required: true },
    actual_hour: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: "0" },
    estimate_start_date: { type: String },
    estimate_finish_date: { type: String },
    actual_start_date: { type: String },
    actual_finish_date: { type: String },
});
exports.default = (0, mongoose_1.model)("task", taskSchema);

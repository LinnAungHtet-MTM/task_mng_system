"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    task_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "task" },
    percentage: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    hr: { type: Number, required: true },
    problem: { type: String },
    report_to: { type: String },
    report_by: { type: String },
    created_at: { type: Date, default: (0, dayjs_1.default)() },
});
exports.default = (0, mongoose_1.model)("report", reportSchema);

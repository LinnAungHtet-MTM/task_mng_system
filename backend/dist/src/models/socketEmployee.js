"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeSchema = new mongoose_1.Schema({
    EmployeeName: { type: String },
    createdBy: { type: String, required: true },
    userId: { type: String, required: true },
    profile: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    project: { type: String },
    read: { type: Array, default: [] },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("employeeNoti", employeeSchema);

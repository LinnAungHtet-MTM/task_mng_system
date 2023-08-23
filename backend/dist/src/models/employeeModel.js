"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeeSchema = new mongoose_1.Schema({
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    profile: { type: String },
    address: { type: String },
    phone: { type: String },
    DOB: { type: String },
    position: { type: String, required: true },
    token: { type: String },
    verified: { type: Boolean },
});
exports.default = (0, mongoose_1.model)("employee", employeeSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notiSchema = new mongoose_1.Schema({
    project: { type: String },
    title: { type: String, required: true },
    report_by: { type: String },
    profile: { type: String, required: true },
    unread: { type: String, default: true },
    userId: { type: String, required: true },
    reportToUserName: { type: String },
    // assignEmployeeId: { type: String },
    // taskCreated: { type: String },
    // status: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("notification", notiSchema);

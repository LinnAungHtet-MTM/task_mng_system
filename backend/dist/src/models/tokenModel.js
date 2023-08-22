"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "employee" },
    token: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("token", tokenSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectModel = new mongoose_1.Schema({
    projectName: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("project", projectModel);
//# sourceMappingURL=projectModel.js.map
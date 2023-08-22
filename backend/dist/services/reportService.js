"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropReportServices = exports.createReportService = exports.getAllReportServices = void 0;
const reportModel_1 = __importDefault(require("../models/reportModel"));
const getAllReportServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield reportModel_1.default.find().populate([
            {
                path: "task_id",
                select: "title project_name",
                populate: {
                    path: "project_name",
                    select: "projectName",
                },
            },
        ]);
        res
            .status(200)
            .json({ success: true, message: "Gell All Report Lists", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to get all report" });
    }
});
exports.getAllReportServices = getAllReportServices;
const createReportService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportData = req.body;
        const data = yield reportModel_1.default.insertMany(reportData);
        res
            .status(201)
            .json({ success: true, message: "New Report Created", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to create report" });
    }
});
exports.createReportService = createReportService;
const dropReportServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield reportModel_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Report Deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to delete report" });
    }
});
exports.dropReportServices = dropReportServices;
//# sourceMappingURL=reportService.js.map
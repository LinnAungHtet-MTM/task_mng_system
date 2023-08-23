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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropReport = exports.createReport = exports.getAllReport = void 0;
const reportService_1 = require("../services/reportService");
const getAllReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, reportService_1.getAllReportServices)(req, res, next);
});
exports.getAllReport = getAllReport;
const createReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, reportService_1.createReportService)(req, res, next);
});
exports.createReport = createReport;
const dropReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, reportService_1.dropReportServices)(req, res, next);
});
exports.dropReport = dropReport;

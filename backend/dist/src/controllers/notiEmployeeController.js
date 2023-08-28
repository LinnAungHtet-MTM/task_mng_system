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
exports.updateEmployeeNoti = exports.createEmployeeNoti = exports.getAllEmployeeNoti = void 0;
const notiEmployeeService_1 = require("../services/notiEmployeeService");
const getAllEmployeeNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiEmployeeService_1.getAllEmployeeNotiService)(req, res, next);
});
exports.getAllEmployeeNoti = getAllEmployeeNoti;
const createEmployeeNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiEmployeeService_1.createEmployeeNotiService)(req, res, next);
});
exports.createEmployeeNoti = createEmployeeNoti;
const updateEmployeeNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiEmployeeService_1.updateEmployeeNotiService)(req, res, next);
});
exports.updateEmployeeNoti = updateEmployeeNoti;

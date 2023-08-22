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
exports.dropEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployeeId = exports.getAllEmployee = void 0;
const employeeService_1 = require("../services/employeeService");
const getAllEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, employeeService_1.getAllEmployeeServices)(req, res, next);
});
exports.getAllEmployee = getAllEmployee;
const getEmployeeId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, employeeService_1.getEmployeeIdService)(req, res, next);
});
exports.getEmployeeId = getEmployeeId;
const createEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, employeeService_1.createEmployeeService)(req, res, next);
});
exports.createEmployee = createEmployee;
const updateEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, employeeService_1.updateEmployeeService)(req, res, next);
});
exports.updateEmployee = updateEmployee;
const dropEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, employeeService_1.dropEmployeeService)(req, res, next);
});
exports.dropEmployee = dropEmployee;
//# sourceMappingURL=employeeController.js.map
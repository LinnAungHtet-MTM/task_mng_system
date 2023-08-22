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
exports.updateTask = exports.getTask = exports.createTask = exports.getAllTask = void 0;
const taskService_1 = require("../services/taskService");
const getAllTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, taskService_1.getAllTaskService)(req, res, next);
});
exports.getAllTask = getAllTask;
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, taskService_1.createTaskService)(req, res, next);
});
exports.createTask = createTask;
const getTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, taskService_1.getTaskById)(req, res, next);
});
exports.getTask = getTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, taskService_1.updateTaskService)(req, res, next);
});
exports.updateTask = updateTask;

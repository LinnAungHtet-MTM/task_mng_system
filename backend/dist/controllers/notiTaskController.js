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
exports.updateTaskNoti = exports.createTaskNoti = exports.getAllTaskNoti = void 0;
const notiTaskService_1 = require("../services/notiTaskService");
const getAllTaskNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiTaskService_1.getAllTaskNotiService)(req, res, next);
});
exports.getAllTaskNoti = getAllTaskNoti;
const createTaskNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiTaskService_1.createTaskNotiService)(req, res, next);
});
exports.createTaskNoti = createTaskNoti;
const updateTaskNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiTaskService_1.updateTaskNotiService)(req, res, next);
});
exports.updateTaskNoti = updateTaskNoti;
//# sourceMappingURL=notiTaskController.js.map
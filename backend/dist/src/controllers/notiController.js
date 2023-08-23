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
exports.updateNoti = exports.createNoti = exports.getAllNoti = void 0;
const notiService_1 = require("../services/notiService");
const getAllNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiService_1.getAllNotificationService)(req, res, next);
});
exports.getAllNoti = getAllNoti;
const createNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiService_1.createNotiService)(req, res, next);
});
exports.createNoti = createNoti;
const updateNoti = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, notiService_1.updateNotiService)(req, res, next);
});
exports.updateNoti = updateNoti;

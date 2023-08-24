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
exports.updateTaskNotiService = exports.createTaskNotiService = exports.getAllTaskNotiService = void 0;
const socketTask_1 = __importDefault(require("../models/socketTask"));
const getAllTaskNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield socketTask_1.default.find();
        res
            .status(200)
            .json({ success: true, message: "All Notification data", data });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err, message: "Failed to get all notification" });
    }
});
exports.getAllTaskNotiService = getAllTaskNotiService;
const createTaskNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notiData = req.body;
        const data = yield socketTask_1.default.insertMany(notiData);
        res
            .status(201)
            .json({ success: true, message: "New Noti List Created", data });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err, message: "Failed to create notification" });
    }
});
exports.createTaskNotiService = createTaskNotiService;
const updateTaskNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notiData = {
            $push: req.body,
        };
        const noti = yield socketTask_1.default.findById(req.params.id);
        if (noti) {
            const data = yield socketTask_1.default.findByIdAndUpdate(noti._id, notiData);
            res
                .status(200)
                .json({ success: true, message: "Noti Updated Successfully", data });
        }
        else {
            res
                .status(400)
                .json({ success: false, message: "No Notification with this id" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err, message: "Failed to update notification" });
    }
});
exports.updateTaskNotiService = updateTaskNotiService;

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
exports.updateEmployeeNotiService = exports.createEmployeeNotiService = exports.getAllEmployeeNotiService = void 0;
const socketEmployee_1 = __importDefault(require("../models/socketEmployee"));
const getAllEmployeeNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield socketEmployee_1.default.find().sort({ createdAt: -1 });
        res
            .status(200)
            .json({ success: true, message: "All Employee Notification data", data });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err, message: "Failed to get all notification" });
    }
});
exports.getAllEmployeeNotiService = getAllEmployeeNotiService;
const createEmployeeNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notiData = req.body;
        const data = yield socketEmployee_1.default.insertMany(notiData);
        res
            .status(201)
            .json({ success: true, message: "New Employee Noti List Created", data });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: err, message: "Failed to create notification" });
    }
});
exports.createEmployeeNotiService = createEmployeeNotiService;
const updateEmployeeNotiService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notiData = {
            $push: req.body,
        };
        const noti = yield socketEmployee_1.default.findById(req.params.id);
        if (noti) {
            const data = yield socketEmployee_1.default.findByIdAndUpdate(noti._id, notiData);
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
exports.updateEmployeeNotiService = updateEmployeeNotiService;

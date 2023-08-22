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
exports.updateTaskService = exports.getTaskById = exports.createTaskService = exports.getAllTaskService = void 0;
const taskModel_1 = require("../models/taskModel");
const getAllTaskService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield taskModel_1.default.find().populate([
            {
                path: "project_name",
                select: "_id projectName",
            },
            {
                path: "assigned_employee",
                select: "_id employeeName",
            },
        ]);
        res.status(200).json({ success: true, message: "All Task List", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to get all task" });
    }
});
exports.getAllTaskService = getAllTaskService;
const createTaskService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskData = Object.assign({}, req.body);
        const data = yield new taskModel_1.default(taskData).save();
        res.status(201).json({ success: true, message: "New Task Added", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to create task" });
    }
});
exports.createTaskService = createTaskService;
const getTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield taskModel_1.default.findById(req.params.id).populate([
            { path: "project_name", select: "_id projectName" },
            { path: "assigned_employee", select: "_id employeeName" },
        ]);
        if (task) {
            res
                .status(200)
                .json({ success: true, message: "Get Task by id", data: task });
        }
        else {
            res.json({ success: false, message: "No Task with this id" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Task not found" });
    }
});
exports.getTaskById = getTaskById;
const updateTaskService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskData = Object.assign({}, req.body);
        const task = yield taskModel_1.default.findById(req.params.id);
        if (task) {
            yield taskModel_1.default.findByIdAndUpdate(task._id, taskData);
            const updateTask = yield taskModel_1.default.find(task._id).populate([
                { path: "project_name", select: "_id projectName" },
                { path: "assigned_employee", select: "_id employeeName" },
            ]);
            res.status(200).json({
                success: true,
                message: "Task Updated Successfully",
                data: updateTask,
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to update task" });
    }
});
exports.updateTaskService = updateTaskService;

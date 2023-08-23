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
exports.dropProjectService = exports.updateProjectService = exports.getProjectIdService = exports.createProjectServices = exports.getProjectServices = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const getProjectServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield projectModel_1.default.find();
        res.status(200).json({ success: true, message: "All Projects", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to get all project" });
    }
});
exports.getProjectServices = getProjectServices;
const createProjectServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectData = {
            projectName: req.body.projectName,
            language: req.body.language,
            description: req.body.description,
            startDate: (0, dayjs_1.default)(req.body.startDate).format("YYYY-MM-DD"),
            endDate: (0, dayjs_1.default)(req.body.endDate).format("YYYY-MM-DD"),
        };
        const data = yield new projectModel_1.default(projectData).save();
        res
            .status(201)
            .json({ success: true, message: "New Project Created", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to create project" });
    }
});
exports.createProjectServices = createProjectServices;
const getProjectIdService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield projectModel_1.default.findById(req.params.id);
        if (data) {
            return res
                .status(201)
                .json({ success: true, message: "Get single project by id", data });
        }
        else {
            res.json({ success: false, message: "No project with this id" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Project not found" });
    }
});
exports.getProjectIdService = getProjectIdService;
const updateProjectService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectData = {
            projectName: req.body.projectName,
            language: req.body.language,
            description: req.body.description,
            startDate: (0, dayjs_1.default)(req.body.startDate).format("YYYY-MM-DD"),
            endDate: (0, dayjs_1.default)(req.body.endDate).format("YYYY-MM-DD"),
        };
        const data = yield projectModel_1.default.findById(req.params.id);
        if (data) {
            yield projectModel_1.default.findByIdAndUpdate(data._id, projectData);
            const updateProject = yield projectModel_1.default.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: "Project Updated Successfully",
                data: updateProject,
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to update project" });
    }
});
exports.updateProjectService = updateProjectService;
const dropProjectService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield projectModel_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Project Deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to delete project" });
    }
});
exports.dropProjectService = dropProjectService;

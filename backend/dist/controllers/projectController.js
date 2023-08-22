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
exports.dropProject = exports.updateProject = exports.getProjectId = exports.createProject = exports.getProject = void 0;
const projectService_1 = require("../services/projectService");
const getProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, projectService_1.getProjectServices)(req, res, next);
});
exports.getProject = getProject;
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, projectService_1.createProjectServices)(req, res, next);
});
exports.createProject = createProject;
const getProjectId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, projectService_1.getProjectIdService)(req, res, next);
});
exports.getProjectId = getProjectId;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, projectService_1.updateProjectService)(req, res, next);
});
exports.updateProject = updateProject;
const dropProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, projectService_1.dropProjectService)(req, res, next);
});
exports.dropProject = dropProject;
//# sourceMappingURL=projectController.js.map
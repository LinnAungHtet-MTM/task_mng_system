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
exports.dropEmployeeService = exports.updateEmployeeService = exports.createEmployeeService = exports.getEmployeeIdService = exports.getAllEmployeeServices = void 0;
const employeeModel_1 = require("../models/employeeModel");
const cloudinary_1 = require("cloudinary");
const randomstring_1 = require("randomstring");
const bcrypt_1 = require("bcrypt");
const sendEmail_1 = require("../utils/sendEmail");
const jsonwebtoken_1 = require("jsonwebtoken");
const getAllEmployeeServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield employeeModel_1.default.find();
        res.status(200).json({ success: true, message: "All Employee List", data });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to get all employee" });
    }
});
exports.getAllEmployeeServices = getAllEmployeeServices;
const getEmployeeIdService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield employeeModel_1.default.findById(req.params.id);
        if (data) {
            return res
                .status(201)
                .json({ success: true, message: "Get employee by id", data });
        }
        else {
            res.json({ success: false, message: "No employee with this id" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Employee not found" });
    }
});
exports.getEmployeeIdService = getEmployeeIdService;
const createEmployeeService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const employeeData = {
            employeeName: req.body.employeeName,
            email: req.body.email,
            profile: req.body.profile,
            address: req.body.address ? req.body.address : "",
            phone: req.body.phone ? req.body.phone : "",
            DOB: req.body.DOB ? req.body.DOB : "",
            position: req.body.position,
        };
        if (req.file) {
            const upload = yield cloudinary_1.v2.uploader.upload(((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "");
            employeeData.profile = upload.secure_url;
        }
        else {
            employeeData.profile =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsf_0pUDPlKJNpqfEG_XdAlEqXl0ARhJ82BMEHJDA8bPTV_J_b70U_QSG6wQETB4kvVgM&usqp=CAU";
        }
        const email = req.body.email;
        const findEmployee = yield employeeModel_1.default.findOne({ email });
        if (findEmployee) {
            res.status(400).json({ message: "Employee already exist" });
        }
        else {
            const randomPassword = randomstring_1.default.generate(8);
            const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
            const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: "1D",
            });
            const data = yield new employeeModel_1.default(Object.assign(Object.assign({}, employeeData), { password: hashedPassword, token, verified: false })).save();
            const verifyLink = `http://localhost:5173/verify?token=${token}`;
            const text = `Hello,\n\n Your Email is: ${email} \n\n Your random password is: ${randomPassword}\n\n You can use this password to log in.\n\n Please Click the following link to verify your account! \n\n ${verifyLink}`;
            (0, sendEmail_1.default)(email, "Your Randomly Generated Password", text);
            res
                .status(201)
                .json({ success: true, message: "New Employee Added", data });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to create employee" });
    }
});
exports.createEmployeeService = createEmployeeService;
const updateEmployeeService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const employeeData = {
            employeeName: req.body.employeeName,
            email: req.body.email,
            profile: req.body.profile,
            address: req.body.address ? req.body.address : "",
            phone: req.body.phone ? req.body.phone : "",
            DOB: req.body.DOB ? req.body.DOB : "",
            position: req.body.position,
        };
        if (req.file) {
            const upload = yield cloudinary_1.v2.uploader.upload(((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || "");
            employeeData.profile = upload.secure_url;
        }
        else if (employeeData.profile === "null") {
            employeeData.profile =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsf_0pUDPlKJNpqfEG_XdAlEqXl0ARhJ82BMEHJDA8bPTV_J_b70U_QSG6wQETB4kvVgM&usqp=CAU";
        }
        const email = req.body.email;
        const findEmployee = yield employeeModel_1.default.findOne({
            email,
            _id: { $ne: req.params.id },
        });
        if (findEmployee) {
            return res.status(400).json({ message: "Employee already exist" });
        }
        const data = yield employeeModel_1.default.findById(req.params.id);
        if (data) {
            yield employeeModel_1.default.findByIdAndUpdate(data._id, employeeData);
            const updateEmployee = yield employeeModel_1.default.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: "Employee Updated Successfully",
                data: updateEmployee,
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to update employee" });
    }
});
exports.updateEmployeeService = updateEmployeeService;
const dropEmployeeService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield employeeModel_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Employee Deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to delete employee" });
    }
});
exports.dropEmployeeService = dropEmployeeService;

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
exports.verifyAccountService = exports.resetPasswordService = exports.forgetPasswordService = exports.changePasswordService = exports.loginService = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const loginService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield employeeModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email does not exists" });
        }
        if (!user.verified) {
            return res
                .status(401)
                .json({ message: "Please first verify your email" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, type: user.position }, process.env.JWT_SECRET, { expiresIn: "1D" });
        return res
            .status(200)
            .json({ message: "Logged In successfully!", token, userId: user._id });
    }
    catch (err) {
        return res.status(500).json({ error: err, message: "Failed to login" });
    }
});
exports.loginService = loginService;
const changePasswordService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const user = yield employeeModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "This user does not exists!" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Wrong old password!" });
        }
        if (oldPassword === newPassword) {
            return res
                .status(400)
                .json({ message: "Old Password and new Password must not same!" });
        }
        if (newPassword === confirmPassword) {
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            user.password = hashedPassword;
            yield user.save();
            return res.status(200).json({ message: "Changed Password successfully" });
        }
        else {
            return res
                .status(400)
                .json({ message: "New Password and confirm password must same!" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to change password" });
    }
});
exports.changePasswordService = changePasswordService;
const forgetPasswordService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield employeeModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "This user does not exists!" });
        }
        const resetPasswordLink = `Hello,\n\n Please click the following link to reset your password: \n\n http://localhost:5173/reset-password/${user._id}`;
        (0, sendEmail_1.default)(email, "Reset Password", resetPasswordLink);
        res.status(200).json({ message: "Reset Password Link send to your email" });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to forget password" });
    }
});
exports.forgetPasswordService = forgetPasswordService;
const resetPasswordService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res
                .status(400)
                .json({ message: "New Password and confirm password must same!" });
        }
        const user = yield employeeModel_1.default.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "This user does not exists!" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Change Password Successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to reset password" });
    }
});
exports.resetPasswordService = resetPasswordService;
const verifyAccountService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const employeeData = yield employeeModel_1.default.findOne({ token });
        if (employeeData) {
            yield employeeModel_1.default.findOneAndUpdate({ token: employeeData.token }, {
                verified: true,
                token: null,
            });
            return res.status(200).json({ message: "Account Verified" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err, message: "Failed to verify account" });
    }
});
exports.verifyAccountService = verifyAccountService;

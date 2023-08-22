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
exports.verifyAccount = exports.resetPassword = exports.forgetPassword = exports.changePassword = exports.login = void 0;
const authService_1 = require("../services/authService");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.loginService)(req, res, next);
});
exports.login = login;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.changePasswordService)(req, res, next);
});
exports.changePassword = changePassword;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.forgetPasswordService)(req, res, next);
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.resetPasswordService)(req, res, next);
});
exports.resetPassword = resetPassword;
const verifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authService_1.verifyAccountService)(req, res, next);
});
exports.verifyAccount = verifyAccount;
//# sourceMappingURL=authController.js.map
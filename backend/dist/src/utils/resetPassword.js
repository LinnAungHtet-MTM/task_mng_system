"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ResetPasswordText = ({ resetLink }) => (<>
    <p>Hello,</p>
    <p>Please click the following link to reset your password:</p>
    <a href={resetLink}>Your reset password link</a>
  </>);
exports.default = ResetPasswordText;

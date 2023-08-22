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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ message: "Access Denied." });
        }
        if (typeof token === "string" && token.startsWith("Bearer ")) {
            // token = token.split(" ")[1];
            const tokenValue = token.split(" ")[1];
            const verified = jsonwebtoken_1.default.verify(tokenValue, process.env.JWT_SECRET);
            req.body["userToken"] = verified;
            next();
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map
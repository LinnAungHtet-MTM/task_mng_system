import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: any = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Access Denied." });
    }
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      // token = token.split(" ")[1];
      const tokenValue = token.split(" ")[1];
      const verified = jwt.verify(tokenValue, process.env.JWT_SECRET!);
      req.body["userToken"] = verified;
      next();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export default verifyToken;

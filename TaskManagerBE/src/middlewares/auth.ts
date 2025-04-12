import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "taskManagerSecret";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: "Failed to authenticate token" });
        return;
      }
      next();
    });
  } catch (error) {
    console.error("Error in validateToken middleware:", error);
    res.status(403).json({ message: "Failed to authenticate token" });
    return;
  }
};

export default validateToken;

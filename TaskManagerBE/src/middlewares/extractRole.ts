import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "taskManagerSecret";

const extractRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (decoded) {
        (req as any).user = decoded;
      }
      next();
    });
  } catch (error) {
    console.error("Error in extract role middleware:", error);
    next();
    return;
  }
};

export default extractRole;

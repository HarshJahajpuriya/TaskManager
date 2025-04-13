import { Request, Response } from "express";
import User from "../models/User";
import { ROLES, User as UserType } from "../types/user";

export const getAllUsers = async (req: Request, res: Response) => {
  const user: UserType = (req as any).user;
  try {
    if (user.role === ROLES.EMPLOYEE) {
      const users = await User.find({ _id: user._id });
      users.forEach((user) => {
        user.password = undefined;
      });
      res.status(200).json(users);
    } else if (user.role === ROLES.TEAM_LEAD) {
      const users = await User.find({
        role: { $ne: ROLES.MANAGER },
      });
      users.forEach((user) => {
        user.password = undefined;
      });
      res.status(200).json(users);
    } else {
      const users = await User.find();
      users.forEach((user) => {
        user.password = undefined;
      });
      res.status(200).json(users);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

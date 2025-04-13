import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { User as UserType } from "../types/user";

const JWT_SECRET = process.env.JWT_SECRET || "taskManagerSecret";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: UserType = req.body;

    let existingUser = await User.findOne({ username: user.username });
    if (!existingUser) existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const newUser = new User({
      ...user,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });
    if (!user) user = await User.findOne({ email: username });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const userToSend = { ...user.toObject(), password: undefined };
    const token = jwt.sign(userToSend, JWT_SECRET, { expiresIn: "12h" });

    res.json({ token, user: userToSend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

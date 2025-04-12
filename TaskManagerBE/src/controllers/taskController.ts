import { Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import { Task as TaskType, User as UserType } from "../utils/types";
import { ROLES } from "../utils/enums";
import User from "../models/User";

export const getTasks = async (req: Request, res: Response) => {
  const user: UserType = (req as any).user;

  try {
    if (user.role === ROLES.EMPLOYEE) {
      const tasks = await Task.find({ assignedTo: user._id })
        .sort({ createdAt: -1 })
        .populate("assignedTo")
        .populate("creator");
      res.status(200).json(tasks);
    } else if (user.role === ROLES.TEAM_LEAD) {
      const tasks = await Task.find({
        assignedTo: {
          $nin: await User.find({ role: ROLES.MANAGER }).distinct("_id"),
        },
      })
        .sort({ createdAt: -1 })
        .populate("assignedTo")
        .populate("creator");
      res.status(200).json(tasks);
    } else {
      const tasks = await Task.find({})
        .sort({ createdAt: -1 })
        .populate("assignedTo")
        .populate("creator");
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Task ID" });
    return;
  }

  try {
    const task = await Task.findById(id)
      .populate("assignedTo")
      .populate("creator");
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskToCreate: TaskType = req.body;
    const task = await Task.create(taskToCreate);
    const createdTask = await Task.findById(task._id)
      .populate("assignedTo")
      .populate("creator");
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Task ID" });
    return;
  }

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid Task ID" });
    return;
  }

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    const createdTask = await Task.findById(task._id)
      .populate("assignedTo")
      .populate("creator");
    if (!createdTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json(createdTask);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

import express from "express";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const taskRoutes = express.Router();

taskRoutes.get("/", getTasks);
taskRoutes.post("/", createTask);
taskRoutes.get("/:id", getTask);
taskRoutes.patch("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;

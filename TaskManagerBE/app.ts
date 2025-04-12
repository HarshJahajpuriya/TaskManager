import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDb from "./src/config/db";
import authRoutes from "./src/routes/authRoutes";
import validateToken from "./src/middlewares/auth";
import extractRole from "./src/middlewares/extractRole";
import taskRoutes from "./src/routes/taskRoutes";
import userRoutes from "./src/routes/userRoutes";
import { Task } from "./src/utils/types";

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// database connection
connectDb();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/tasks", validateToken, extractRole, taskRoutes);
app.use("/users", validateToken, extractRole, userRoutes);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("task-got-updated", (task: Task) => {
    console.log(`Task Updated by : ${task._id}`);
    socket.broadcast.emit("update-task", task);
  });

  socket.on("task-got-added", (task: Task) => {
    console.log(`Task Created by : ${task._id}`);
    socket.broadcast.emit("add-task", task);
  });

  socket.on("task-got-deleted", (taskId: string) => {
    console.log(`Task Deleted by : ${taskId}`);
    socket.broadcast.emit("remove-task", taskId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

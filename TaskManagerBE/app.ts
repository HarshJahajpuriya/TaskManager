import express from "express";
import cors from "cors";
import connectDb from "./src/config/db";
import authRoutes from "./src/routes/authRoutes";
import validateToken from "./src/middlewares/auth";
import extractRole from "./src/middlewares/extractRole";
import taskRoutes from "./src/routes/taskRoutes";
import userRoutes from "./src/routes/userRoutes";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

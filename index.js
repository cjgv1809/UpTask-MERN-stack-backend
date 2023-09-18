import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";
import projectRoutes from "./routes/ProjectRoutes.js";
import taskRoutes from "./routes/TaskRoutes.js";

const app = express();
app.use(express.json()); // to parse the body of the request

connectDB();

// config cors to allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.CORS_WHITELIST.split(" ").includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_WHITELIST,
  },
});

// open socket connection
io.on("connection", (socket) => {
  // open project
  socket.on("open-project", (projectId) => {
    socket.join(projectId);
  });

  // new task
  socket.on("new-task", (task) => {
    socket.to(task.project).emit("new-task-added", task);
  });

  // delete task
  socket.on("delete-task", (task) => {
    socket.to(task.project).emit("task-deleted", task);
  });

  // update task
  socket.on("update-task", (task) => {
    socket.to(task.project._id).emit("task-updated", task);
  });

  // complete task
  socket.on("complete-task", (task) => {
    socket.to(task.project._id).emit("task-completed", task);
  });
});

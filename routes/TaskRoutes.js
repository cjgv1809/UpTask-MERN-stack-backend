import express from "express";
import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
} from "../controllers/taskController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, addTask);
router
  .route("/:id")
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);
router.post("/status/:id", checkAuth, changeTaskStatus);

export default router;

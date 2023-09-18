import express from "express";
import {
  getProjects,
  newProject,
  getProject,
  updateProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator,
} from "../controllers/projectController.js";
import { checkAuth } from "../middleware/checkAuth.js";

// create a router object
const router = express.Router();

router.get("/", checkAuth, getProjects);
router.post("/", checkAuth, newProject);

// another way to write the above two lines pointing to the same route using route()
router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject);

router.post("/collaborators", checkAuth, searchCollaborator);
router.post("/collaborators/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;

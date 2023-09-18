import express from "express";
import {
  register,
  authenticate,
  confirmEmail,
  forgotPassword,
  verifyToken,
  newPassword,
  profile,
} from "../controllers/userController.js";
import { checkAuth } from "../middleware/checkAuth.js";

// create a router object
const router = express.Router();

// define routes for the router object
// Authentication, register and confirmation of users
router.post("/", register);
router.post("/login", authenticate);
router.get("/confirmation/:token", confirmEmail);

// forget password and reset password routes
router.post("/forgot-password", forgotPassword);
router.get("/forgot-password/:token", verifyToken);
router.post("/forgot-password/:token", newPassword);

// middleware to check if user is logged in
router.get("/profile", checkAuth, profile);

export default router;

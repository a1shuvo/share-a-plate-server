import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  updateUserRole,
  updateUserRoleByEmail,
  upsertUser,
} from "../controllers/usersController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

// Public or post-login
router.put("/upsert", upsertUser);

// Admin only (you can later wrap with role middleware)
router.get("/", verifyJWT, getAllUsers);
router.get("/:email", verifyJWT, getUserByEmail);
router.patch("/:email", verifyJWT, updateUser);
router.delete("/:id", verifyJWT, deleteUser);
router.patch("/role/:id", verifyJWT, updateUserRole);
router.patch("/role-by-email/:email", verifyJWT, updateUserRoleByEmail);

export default router;

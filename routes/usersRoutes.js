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
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

// Public or post-login
router.put("/upsert", upsertUser);

// Admin only (you can later wrap with role middleware)
router.get("/", verifyFBToken, getAllUsers);
router.get("/:email", verifyFBToken, getUserByEmail);
router.patch("/:email", verifyFBToken, updateUser);
router.delete("/:id", verifyFBToken, deleteUser);
router.patch("/role/:id", verifyFBToken, updateUserRole);
router.patch("/role-by-email/:email", verifyFBToken, updateUserRoleByEmail);

export default router;

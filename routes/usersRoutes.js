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
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// Public or post-login
router.put("/upsert", upsertUser);

// Admin only (you can later wrap with role middleware)
router.get("/", verifyFBToken, verifyRole("admin"), getAllUsers);
router.get("/:email", verifyFBToken, getUserByEmail);
router.patch("/:email", verifyFBToken, verifyRole("admin"), updateUser);
router.delete("/:id", verifyFBToken, verifyRole("admin"), deleteUser);
router.patch("/role/:id", verifyFBToken, verifyRole("admin"), updateUserRole);
router.patch(
  "/role-by-email/:email",
  verifyFBToken,
  verifyRole("admin"),
  updateUserRoleByEmail
);

export default router;

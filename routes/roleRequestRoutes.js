import express from "express";
import {
  createRoleRequest,
  getRoleRequestByEmail,
  getAllRoleRequests,
} from "../controllers/roleRequestController.js";

const router = express.Router();

router.post("/", createRoleRequest);
router.get("/user/:email", getRoleRequestByEmail);
router.get("/", getAllRoleRequests); // Optional for admin

export default router;

import express from "express";
import {
  createRoleRequest,
  getAllRoleRequests,
  getRoleRequestByEmail,
  updateRoleRequestStatus,
} from "../controllers/roleRequestController.js";

const router = express.Router();

router.post("/", createRoleRequest);
router.get("/user/:email", getRoleRequestByEmail);
router.get("/", getAllRoleRequests);
router.patch("/:id", updateRoleRequestStatus);

export default router;

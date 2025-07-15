import express from "express";
import {
  createRoleRequest,
  getAllRoleRequests,
  getRoleRequestByEmail,
  updateRoleRequestStatus,
} from "../controllers/roleRequestController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post("/", verifyFBToken, createRoleRequest);
router.get("/user/:email", verifyFBToken, getRoleRequestByEmail);
router.get("/", verifyFBToken, verifyRole("admin"), getAllRoleRequests);
router.patch(
  "/:id",
  verifyFBToken,
  verifyRole("admin"),
  updateRoleRequestStatus
);

export default router;

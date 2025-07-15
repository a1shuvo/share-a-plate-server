import express from "express";
import {
  acceptRequest,
  confirmPickup,
  createRequest,
  deleteRequest,
  getAllRequests,
  getMyAcceptedPickups,
  getMyReceivedDonations,
  getMyRequests,
  getRequestsForRestaurant,
  rejectRequest,
} from "../controllers/requestsController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post("/", verifyFBToken, verifyRole("charity"), createRequest); // Charity: Request donation
router.get("/mine", verifyFBToken, verifyRole("charity"), getMyRequests); // Charity: View their own requests
router.get(
  "/restaurant",
  verifyFBToken,
  verifyRole("restaurant"),
  getRequestsForRestaurant
); // Restaurant: View requests
router.get("/admin/all", verifyFBToken, verifyRole("admin"), getAllRequests); // Admin: View all
router.patch(
  "/accept/:id",
  verifyFBToken,
  verifyRole("restaurant"),
  acceptRequest
); // Restaurant: Accept
router.patch(
  "/reject/:id",
  verifyFBToken,
  verifyRole("restaurant"),
  rejectRequest
); // Restaurant: Reject
router.patch(
  "/confirm/:donationId",
  verifyFBToken,
  verifyRole("charity"),
  confirmPickup
); // Charity: Confirm Pickup
router.get(
  "/my-pickups",
  verifyFBToken,
  verifyRole("charity"),
  getMyAcceptedPickups
); // Charity: My Pickups
router.get(
  "/received",
  verifyFBToken,
  verifyRole("charity"),
  getMyReceivedDonations
); // Charity: Received Donations
router.delete("/:id", verifyFBToken, verifyRole("admin"), deleteRequest); // Admin: Delete request

export default router;

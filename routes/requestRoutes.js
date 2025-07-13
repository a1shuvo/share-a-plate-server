import express from "express";
import {
  acceptRequest,
  confirmPickup,
  createRequest,
  deleteRequest,
  getMyRequests,
  getAllRequests,
  getMyPickups,
  getRequestsForRestaurant,
  rejectRequest,
} from "../controllers/requestsController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

router.post("/", verifyFBToken, createRequest); // Charity: Request donation
router.get("/mine", verifyFBToken, getMyRequests); // Charity: View their own requests
router.get("/restaurant", verifyFBToken, getRequestsForRestaurant); // Restaurant: View requests
router.get("/admin/all", verifyFBToken, getAllRequests); // Admin: View all
router.patch("/accept/:id", verifyFBToken, acceptRequest); // Restaurant: Accept
router.patch("/reject/:id", verifyFBToken, rejectRequest); // Restaurant: Reject
router.patch("/confirm/:donationId", verifyFBToken, confirmPickup); // Charity: Confirm Pickup
router.get("/my-pickups", verifyFBToken, getMyPickups); // Charity: View pickups
router.delete("/:id", verifyFBToken, deleteRequest); // Admin: Delete request

export default router;

import express from "express";
import {
  createDonation,
  deleteDonation,
  getAllDonations,
  getAllVerifiedDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
} from "../controllers/donationsController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

// Public
router.get("/verified", verifyJWT, getAllVerifiedDonations);
router.get("/:id", verifyJWT, getDonationById);

// Admin
router.get("/", verifyJWT, getAllDonations);

// Restaurant only (authenticated)
router.post("/", verifyJWT, createDonation);
router.get("/mine/all", verifyJWT, getMyDonations);
router.patch("/:id", verifyJWT, updateDonation);
router.delete("/:id", verifyJWT, deleteDonation);

export default router;

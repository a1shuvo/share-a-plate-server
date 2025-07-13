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
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

// Public
router.get("/verified", verifyFBToken, getAllVerifiedDonations);
router.get("/:id", verifyFBToken, getDonationById);

// Admin
router.get("/", verifyFBToken, getAllDonations);

// Restaurant only (authenticated)
router.post("/", verifyFBToken, createDonation);
router.get("/mine/all", verifyFBToken, getMyDonations);
router.patch("/:id", verifyFBToken, updateDonation);
router.delete("/:id", verifyFBToken, deleteDonation);

export default router;

import express from "express";
import {
  createDonation,
  deleteDonation,
  featureDonation,
  getAllActiveDonations,
  getAllDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  updateDonationStatusByAdmin,
} from "../controllers/donationsController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

// Public
router.get("/active", verifyFBToken, getAllActiveDonations);
router.get("/:id", verifyFBToken, getDonationById);

// Admin
router.get("/", verifyFBToken, getAllDonations);

// Restaurant only (authenticated)
router.post("/", verifyFBToken, createDonation);
router.get("/mine/all", verifyFBToken, getMyDonations);
router.patch("/:id", verifyFBToken, updateDonation);
router.patch("/admin/status/:id", verifyFBToken, updateDonationStatusByAdmin);
router.patch("/feature/:id", verifyFBToken, featureDonation);
router.delete("/:id", verifyFBToken, deleteDonation);

export default router;

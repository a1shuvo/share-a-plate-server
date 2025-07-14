import express from "express";
import {
  createDonation,
  deleteDonation,
  featureDonation,
  getAllActiveDonations,
  getAllDonations,
  getDonationById,
  getFeaturedDonations,
  getMyDonations,
  updateDonation,
  updateDonationStatusByAdmin,
} from "../controllers/donationsController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

// 📢 Public route
router.get("/featured", getFeaturedDonations);

// ✅ Authenticated (Charity, Admin, Restaurant)
router.get("/active", verifyFBToken, getAllActiveDonations);
router.get("/mine/all", verifyFBToken, getMyDonations);
router.get("/", verifyFBToken, getAllDonations);

// ⚠️ Keep dynamic route at the end to prevent conflicts
router.get("/:id", verifyFBToken, getDonationById);

// ➕ Create donation (Restaurant)
router.post("/", verifyFBToken, createDonation);

// 🔄 Update donation (Restaurant or Admin)
router.patch("/:id", verifyFBToken, updateDonation);
router.patch("/admin/status/:id", verifyFBToken, updateDonationStatusByAdmin);
router.patch("/feature/:id", verifyFBToken, featureDonation);

// ❌ Delete donation (Restaurant)
router.delete("/:id", verifyFBToken, deleteDonation);

export default router;

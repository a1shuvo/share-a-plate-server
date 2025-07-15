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
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// 📢 Public route
router.get("/featured", getFeaturedDonations);

// ✅ Authenticated (Charity, Admin, Restaurant)
router.get("/active", verifyFBToken, getAllActiveDonations);
router.get(
  "/mine/all",
  verifyFBToken,
  verifyRole("restaurant"),
  getMyDonations
);
router.get("/", verifyFBToken, verifyRole("admin"), getAllDonations);

// ⚠️ Keep dynamic route at the end to prevent conflicts
router.get("/:id", verifyFBToken, getDonationById);

// ➕ Create donation (Restaurant)
router.post("/", verifyFBToken, verifyRole("restaurant"), createDonation);

// 🔄 Update donation (Restaurant or Admin)
router.patch("/:id", verifyFBToken, verifyRole("restaurant"), updateDonation);
router.patch(
  "/admin/status/:id",
  verifyFBToken,
  verifyRole("admin"),
  updateDonationStatusByAdmin
);
router.patch(
  "/feature/:id",
  verifyFBToken,
  verifyRole("admin"),
  featureDonation
);

// ❌ Delete donation (Restaurant)
router.delete("/:id", verifyFBToken, verifyRole("restaurant"), deleteDonation);

export default router;

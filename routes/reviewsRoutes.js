import express from "express";
import {
  addReview,
  deleteReview,
  getMyReviews,
  getReviewsByDonation,
} from "../controllers/reviewsController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

router.post("/", verifyFBToken, addReview); // Add review
router.get("/donation/:donationId", getReviewsByDonation); // Public access
router.get("/mine/all", verifyFBToken, getMyReviews); // User reviews
router.delete("/:id", verifyFBToken, deleteReview); // Delete own review

export default router;

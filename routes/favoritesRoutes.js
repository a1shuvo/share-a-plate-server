import express from "express";
import {
  addToFavorites,
  getMyFavorites,
  removeFavorite,
} from "../controllers/favoritesController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

router.post("/", verifyFBToken, addToFavorites); // Add to favorites
router.get("/mine", verifyFBToken, getMyFavorites); // Get logged-in user's favorites
router.delete("/:donationId", verifyFBToken, removeFavorite); // Remove favorite

export default router;

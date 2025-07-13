import { ObjectId } from "mongodb";
import { favoritesCollection, donationsCollection } from "../collections/index.js";

// ✅ Add to Favorites
export const addToFavorites = async (req, res) => {
  try {
    const { donationId } = req.body;
    const userEmail = req.user.email;

    // Check if already favorited
    const exists = await favoritesCollection.findOne({
      donationId: new ObjectId(donationId),
      userEmail,
    });

    if (exists) {
      return res.status(400).json({ error: "Already in favorites" });
    }

    const result = await favoritesCollection.insertOne({
      donationId: new ObjectId(donationId),
      userEmail,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Added to favorites", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to favorites" });
  }
};

// ✅ Get User Favorites
export const getMyFavorites = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const favorites = await favoritesCollection
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    const donationIds = favorites.map((fav) => fav.donationId);

    const donations = await donationsCollection
      .find({ _id: { $in: donationIds } })
      .toArray();

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// ✅ Remove from Favorites
export const removeFavorite = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userEmail = req.user.email;

    const result = await favoritesCollection.deleteOne({
      donationId: new ObjectId(donationId),
      userEmail,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favorite not found or unauthorized" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

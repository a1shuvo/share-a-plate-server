import { ObjectId } from "mongodb";
import {
  donationsCollection,
  reviewsCollection,
} from "../collections/index.js";

// ✅ Add a Review
export const addReview = async (req, res) => {
  try {
    const { donationId, name, description, rating } = req.body;

    const review = {
      donationId: new ObjectId(donationId),
      name,
      description,
      rating,
      userEmail: req.user.email,
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(review);

    // Add review to donation document as well (optional denormalization)
    await donationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $push: { reviews: review } }
    );

    res
      .status(201)
      .json({ message: "Review added", insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

// ✅ Get Reviews by Donation ID
export const getReviewsByDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const reviews = await reviewsCollection
      .find({ donationId: new ObjectId(donationId) })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Get My Reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await reviewsCollection
      .find({ userEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch my reviews" });
  }
};

// ✅ Delete a Review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(id),
      userEmail: req.user.email,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Review not found or unauthorized" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// ✅ Optional: Delete reviews when donation is deleted
export const deleteReviewsByDonationId = async (donationId) => {
  try {
    await reviewsCollection.deleteMany({
      donationId: new ObjectId(donationId),
    });
  } catch (err) {
    console.error("Failed to delete reviews with donation:", err.message);
  }
};

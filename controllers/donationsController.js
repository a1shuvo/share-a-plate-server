import { ObjectId } from "mongodb";
import { donationsCollection } from "../collections/index.js";
import { deleteReviewsByDonationId } from "./reviewsController.js";

// ✅ Create Donation
export const createDonation = async (req, res) => {
  try {
    const donation = {
      title: req.body.title,
      description: req.body.description,
      quantity: req.body.quantity,
      foodType: req.body.foodType,
      pickupTime: req.body.pickupTime,
      image: req.body.image,
      location: req.body.location,
      status: "Pending",
      isFeatured: false,
      restaurant: {
        name: req.user.name,
        email: req.user.email,
        userId: req.user._id,
      },
      createdAt: new Date(),
    };
    const result = await donationsCollection.insertOne(donation);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create donation" });
  }
};

// ✅ GET /donations - Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await donationsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(donations);
  } catch (err) {
    console.error("Failed to get donations:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// ✅ Get All Verified Donations
export const getAllVerifiedDonations = async (req, res) => {
  const donations = await donationsCollection
    .find({ status: "Verified" })
    .toArray();
  res.json(donations);
};

// ✅ Get My Donations (Restaurant)
export const getMyDonations = async (req, res) => {
  const email = req.user.email;
  const myDonations = await donationsCollection
    .find({ "restaurant.email": email })
    .toArray();
  res.json(myDonations);
};

// ✅ Get Single Donation by ID
export const getDonationById = async (req, res) => {
  const { id } = req.params;
  const donation = await donationsCollection.findOne({ _id: new ObjectId(id) });
  if (!donation) return res.status(404).json({ error: "Donation not found" });
  res.json(donation);
};

// ✅ Update Donation (only if Pending or Verified)
export const updateDonation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const filter = { _id: new ObjectId(id), "restaurant.email": req.user.email };

  const result = await donationsCollection.updateOne(filter, { $set: updates });
  if (result.matchedCount === 0)
    return res.status(404).json({ error: "Not authorized or not found" });

  res.json({
    message: "Donation updated",
    modifiedCount: result.modifiedCount,
  });
};

// ✅ Admin can verify or reject donations
export const updateDonationStatusByAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Optional: Restrict only to "Verified" or "Rejected"
  if (!["Verified", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const result = await donationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json({
      message: `Donation marked as ${status}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Toggle isFeatured field for a donation by admin
export const featureDonation = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await donationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    const newStatus = !donation.isFeatured;

    const result = await donationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isFeatured: newStatus } }
    );

    res.json({
      message: `Donation ${newStatus ? "marked as" : "removed from"} featured`,
      modifiedCount: result.modifiedCount,
      isFeatured: newStatus,
    });
  } catch (err) {
    console.error("Error toggling featured donation:", err);
    res.status(500).json({ error: "Failed to update featured status" });
  }
};

// ✅ Delete Donation
export const deleteDonation = async (req, res) => {
  const { id } = req.params;
  const result = await donationsCollection.deleteOne({
    _id: new ObjectId(id),
    "restaurant.email": req.user.email,
  });
  await deleteReviewsByDonationId(id); // Delete Reviews when donation is deleted
  if (result.deletedCount === 0)
    return res.status(404).json({ error: "Not found or unauthorized" });

  res.json({ message: "Donation deleted" });
};

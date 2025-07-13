import { ObjectId } from "mongodb";
import {
  donationsCollection,
  requestsCollection,
} from "../collections/index.js";

// ➕ Create a donation request (Charity)
export const createRequest = async (req, res) => {
  try {
    const request = {
      donationId: new ObjectId(req.body.donationId),
      donationTitle: req.body.title,
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      restaurantName: req.body.restaurantName,
      charityName: req.user.name,
      charityEmail: req.user.email,
      requestDescription: req.body.description,
      pickupTime: req.body.pickupTime,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await requestsCollection.insertOne(request);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to request donation" });
  }
};

// ✅ Get all requests for restaurant's donations
export const getRequestsForRestaurant = async (req, res) => {
  try {
    const email = req.user.email;
    const requests = await requestsCollection
      .find({ restaurantEmail: email })
      .toArray();

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Get my requests (Charity)
export const getMyRequests = async (req, res) => {
  try {
    const email = req.user.email;
    const requests = await requestsCollection
      .find({ charityEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching my requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// 🧾 Get all requests (Admin)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await requestsCollection.find().toArray();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all requests" });
  }
};

// ✅ Accept a request (Restaurant)
export const acceptRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await requestsCollection.findOne({
      _id: new ObjectId(requestId),
    });

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Update the selected request
    await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "Accepted" } }
    );

    // Reject other requests for the same donation
    await requestsCollection.updateMany(
      {
        donationId: request.donationId,
        _id: { $ne: new ObjectId(requestId) },
      },
      { $set: { status: "Rejected" } }
    );

    res.json({ message: "Request accepted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept request" });
  }
};

// ❌ Reject a request (Restaurant)
export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "Rejected" } }
    );

    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// ✅ Confirm Pickup by charity
export const confirmPickup = async (req, res) => {
  try {
    const donationId = req.params.donationId;

    // Update request status
    await requestsCollection.updateOne(
      {
        donationId: new ObjectId(donationId),
        charityEmail: req.user.email,
        status: "Accepted",
      },
      { $set: { status: "Picked Up" } }
    );

    // Update the donation status
    await donationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $set: { status: "Picked Up" } }
    );

    res.json({ message: "Donation marked as Picked Up" });
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm pickup" });
  }
};

// ✅ Get my pickups (Charity)
export const getMyPickups = async (req, res) => {
  try {
    const email = req.user.email;
    const pickups = await requestsCollection
      .find({ charityEmail: email, status: { $in: ["Accepted", "Picked Up"] } })
      .toArray();

    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
};

// 🗑️ Delete a request (Admin)
export const deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const result = await requestsCollection.deleteOne({
      _id: new ObjectId(requestId),
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Request not found" });

    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request" });
  }
};

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
      .aggregate([
        {
          $lookup: {
            from: "donations",
            localField: "donationId",
            foreignField: "_id",
            as: "donation",
          },
        },
        { $unwind: "$donation" },
        {
          $match: {
            "donation.restaurant.email": email,
          },
        },
        {
          $project: {
            donationTitle: "$donation.title",
            foodType: "$donation.foodType",
            quantity: "$donation.quantity",
            location: "$donation.location",
            requestDescription: 1,
            pickupTime: 1,
            charityName: 1,
            charityEmail: 1,
            status: 1,
            createdAt: 1,
          },
        },
      ])
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
      .aggregate([
        {
          $match: {
            charityEmail: email,
          },
        },
        {
          $lookup: {
            from: "donations",
            localField: "donationId",
            foreignField: "_id",
            as: "donation",
          },
        },
        { $unwind: "$donation" },
        {
          $project: {
            donationTitle: "$donation.title",
            foodType: "$donation.foodType",
            quantity: "$donation.quantity",
            location: "$donation.location",
            requestDescription: 1,
            pickupTime: 1,
            status: 1,
            createdAt: 1,
            restaurantName: "$donation.restaurant.name",
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// 🧾 Get all requests (Admin)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await requestsCollection
      .aggregate([
        {
          $lookup: {
            from: "donations",
            localField: "donationId",
            foreignField: "_id",
            as: "donation",
          },
        },
        { $unwind: "$donation" },
        {
          $project: {
            donationTitle: "$donation.title",
            foodType: "$donation.foodType",
            quantity: "$donation.quantity",
            location: "$donation.location",
            requestDescription: 1,
            pickupTime: 1,
            status: 1,
            charityName: 1,
            charityEmail: 1,
            createdAt: 1,
            restaurantName: "$donation.restaurant.name",
          },
        },
      ])
      .toArray();

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

    await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "Accepted" } }
    );

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

    await requestsCollection.updateOne(
      {
        donationId: new ObjectId(donationId),
        charityEmail: req.user.email,
        status: "Accepted",
      },
      { $set: { status: "Picked Up" } }
    );

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
      .aggregate([
        {
          $match: {
            charityEmail: email,
            status: { $in: ["Accepted", "Picked Up"] },
          },
        },
        {
          $lookup: {
            from: "donations",
            localField: "donationId",
            foreignField: "_id",
            as: "donation",
          },
        },
        { $unwind: "$donation" },
        {
          $project: {
            donationTitle: "$donation.title",
            foodType: "$donation.foodType",
            quantity: "$donation.quantity",
            location: "$donation.location",
            status: 1,
            pickupTime: 1,
            restaurantName: "$donation.restaurant.name",
          },
        },
      ])
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

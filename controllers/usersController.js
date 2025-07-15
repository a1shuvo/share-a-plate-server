import { ObjectId } from "mongodb";
import { usersCollection } from "../collections/index.js";
import admin from "../utils/firebaseAdmin.js";

// ✅ Create or Upsert User (used after login/register)
export const upsertUser = async (req, res) => {
  const { email, name, image, isGoogleUser } = req.body;
  const userData = {
    name,
    email,
    image,
    isGoogleUser,
    role: "user",
    joinedAt: new Date(),
  };

  const result = await usersCollection.updateOne(
    { email },
    { $setOnInsert: userData },
    { upsert: true }
  );

  res.json({ message: "User upserted", result });
};

// ✅ Get All Users (admin)
export const getAllUsers = async (req, res) => {
  const users = await usersCollection.find().toArray();
  res.json(users);
};

// ✅ Get Single User by Email
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await usersCollection.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// ✅ Update User Profile (self-update)
export const updateUser = async (req, res) => {
  const { email } = req.params;
  const updates = req.body;

  const result = await usersCollection.updateOne({ email }, { $set: updates });
  res.json({ message: "User updated", result });
};

// ✅ Delete User (admin only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Step 1: Find user in MongoDB to get email
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Step 2: Delete from MongoDB
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    // Step 3: Get Firebase user by email (since uid is not stored)
    const fbUser = await admin.auth().getUserByEmail(user.email);
    // Step 4: Delete from Firebase
    await admin.auth().deleteUser(fbUser.uid);
    res.json({ message: "User deleted from MongoDB and Firebase" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ✅ Change User Role (admin only)
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "charity", "restaurant", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );

  res.json({ message: `User role updated to ${role}`, result });
};

// ✅ Change User Role by Email (used when only email is available)
export const updateUserRoleByEmail = async (req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  if (!["user", "charity", "restaurant", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const result = await usersCollection.updateOne({ email }, { $set: { role } });

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: `User role updated to ${role}`, result });
};

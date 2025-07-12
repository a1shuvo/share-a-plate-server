import { ObjectId } from "mongodb";
import { usersCollection } from "../collections/index.js";

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
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
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

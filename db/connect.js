import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("shareaplate");

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw new Error("MongoDB connection error");
  }
};

export { client, db };

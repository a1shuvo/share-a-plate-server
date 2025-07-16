import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db/connect.js";
import createApp from "./app.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const app = createApp();
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
  }
};

startServer();


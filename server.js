import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connect.js";
import donationsRoutes from "./routes/donationsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import roleRequestRoutes from "./routes/roleRequestRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("ShareAPlate API is running...");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Server start failed", err);
  }
};

startServer();

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/donations", donationsRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/role-requests", roleRequestRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/requests", requestRoutes);

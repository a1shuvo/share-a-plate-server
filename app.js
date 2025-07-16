// app.js
import express from "express";
import cors from "cors";

import donationsRoutes from "./routes/donationsRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import roleRequestRoutes from "./routes/roleRequestRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const allowedOrigins = [
  "https://share-a-plate-a1shuvo.web.app",
  "http://localhost:5173",
];

export default function createApp() {
  const app = express();

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("✅ ShareAPlate API is running");
  });

  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/donations", donationsRoutes);
  app.use("/api/v1/payments", paymentRoutes);
  app.use("/api/v1/role-requests", roleRequestRoutes);
  app.use("/api/v1/transactions", transactionRoutes);
  app.use("/api/v1/requests", requestRoutes);
  app.use("/api/v1/reviews", reviewsRoutes);
  app.use("/api/v1/favorites", favoritesRoutes);

  return app;
}

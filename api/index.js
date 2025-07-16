// api/index.js (for Vercel)
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../db/connect.js";
import createApp from "../app.js";

let app;

export default async function handler(req, res) {
  if (!app) {
    await connectDB();
    app = createApp();
  }
  return app(req, res);
}

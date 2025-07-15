import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

router.post("/create-payment-intent", verifyFBToken, createPaymentIntent);

export default router;

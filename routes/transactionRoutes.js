import express from "express";
import {
  getAllTransactions,
  getTransactionsByEmail,
  saveTransaction,
} from "../controllers/transactionController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";

const router = express.Router();

router.post("/", verifyFBToken, saveTransaction);
router.get("/", verifyFBToken, getTransactionsByEmail);
router.get("/all", verifyFBToken, getAllTransactions);

export default router;

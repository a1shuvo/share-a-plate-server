import express from "express";
import {
  getAllTransactions,
  getTransactionsByEmail,
  saveTransaction,
} from "../controllers/transactionController.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/", verifyJWT, saveTransaction);
router.get("/", verifyJWT, getTransactionsByEmail);
router.get("/", verifyJWT, getAllTransactions);

export default router;

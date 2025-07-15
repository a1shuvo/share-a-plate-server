import express from "express";
import {
  getAllTransactions,
  getTransactionsByEmail,
  saveTransaction,
} from "../controllers/transactionController.js";
import { verifyFBToken } from "../middlewares/verifyFBToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post("/", verifyFBToken, saveTransaction);
router.get("/", verifyFBToken, getTransactionsByEmail);
router.get("/all", verifyFBToken, verifyRole("admin"), getAllTransactions);

export default router;

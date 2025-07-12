import express from "express";
import {
  saveTransaction,
  getAllTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", saveTransaction);
router.get("/", getAllTransactions); // Optional for admin panel

export default router;

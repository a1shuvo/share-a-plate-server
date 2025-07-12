import { transactionsCollection } from "../collections/index.js";

// POST /api/transactions
export const saveTransaction = async (req, res) => {
  try {
    const transaction = req.body;
    transaction.createdAt = new Date();
    const result = await transactionsCollection.insertOne(transaction);
    res.status(201).json({ message: "Transaction saved", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save transaction" });
  }
};

// (Optional: get all)
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionsCollection.find().toArray();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

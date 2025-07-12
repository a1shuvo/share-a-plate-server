import { roleRequestsCollection } from "../collections/index.js";

// POST /api/role-requests
export const createRoleRequest = async (req, res) => {
  try {
    const request = req.body;
    request.createdAt = new Date();
    const result = await roleRequestsCollection.insertOne(request);
    res.status(201).json({ message: "Role request saved", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save role request" });
  }
};

// GET /api/role-requests/user/:email
export const getRoleRequestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const request = await roleRequestsCollection.findOne({ email });
    if (!request) return res.status(404).json({});
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role request" });
  }
};

// (Optional: for admin)
export const getAllRoleRequests = async (req, res) => {
  try {
    const requests = await roleRequestsCollection.find().toArray();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role requests" });
  }
};

import { usersCollection } from "../collections/index.js";
import admin from "../utils/firebaseAdmin.js";

export const verifyFBToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;

    // Find user in DB by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found in database" });
    }

    // Attach user info and role to request
    req.user = {
      name:
        user.name ||
        decodedToken.name ||
        decodedToken.displayName ||
        "Anonymous",
      email: user.email,
      _id: user._id,
      role: user.role || "user", // Default to "user" if not set
    };

    next();
  } catch (err) {
    console.error("verifyFBToken error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

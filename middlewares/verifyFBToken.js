// middlewares/verifyFBToken.js
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

    // Attach user info to request
    req.user = {
      name: decodedToken.name || "Anonymous",
      email: decodedToken.email,
      _id: decodedToken.uid,
    };

    next();
  } catch (err) {
    console.error("verifyFBToken error:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// req.user = {
//   name: "Demo Restaurant",
//   email: "restaurant@example.com",
//   _id: "123abc",
// };

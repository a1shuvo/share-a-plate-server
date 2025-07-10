export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Normally verify JWT here (e.g., using Firebase or custom token)
  // For demo purpose, fake user:
  req.user = {
    name: "Demo Restaurant",
    email: "restaurant@example.com",
    _id: "123abc",
  };
  next();
};

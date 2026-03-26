const jwt = require("jsonwebtoken");
require("dotenv").config(); 
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Expect header: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Use the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach doctor info
    next();

  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
const jwt = require("jsonwebtoken");
const Users = require("../models/auth");
const { JWT_SECRET_KEY } = process.env;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Access Token Missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Token Missing" });

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Unauthorized or invalid token" });
  }
};

// Middleware to verify Admin role
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.uid) return res.status(401).json({ message: "UID missing from request" });

    const user = await Users.findOne({ uid: req.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "NGO" && user.role !== "NGO") {
      return res.status(403).json({ message: "Admin access only", isError: true });
    }

    next();
  } catch (err) {
    console.error("Admin verification error:", err);
    return res.status(500).json({ message: "Error checking admin role", isError: true });
  }
};

// Middleware to verify Customer role
const verifyCustomer = async (req, res, next) => {
  try {
    if (!req.uid) return res.status(401).json({ message: "UID missing from request" });

    const user = await Users.findOne({ uid: req.uid });
    if (!user || user.role !== "Donor") {
      return res.status(403).json({ message: "Donor access only", isError: true });
    }

    next();
  } catch (err) {
    console.error("Donor verification error:", err);
    return res.status(500).json({ message: "Error checking Donor role", isError: true });
  }
};

module.exports = { verifyToken, verifyAdmin, verifyCustomer };

const jwt = require("jsonwebtoken");
const Users = require("../models/auth");

const { JWT_SECRET_KEY } = process.env;

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Token Missing" });

  jwt.verify(token, JWT_SECRET_KEY, async (error, result) => {
    if (!error) {
      req.uid = result.uid;
      // req.user = user;
      // req.uid = decoded.uid;
      next();
    } else {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Unauthorized or token invalid" });
    }
  });
};

// ✅ Middleware to verify Admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ uid: req.uid });

    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Admin access only", isError: true });
    }
    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin access only", isError: true });
    // }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error checking admin role", isError: true });
  }
};

// ✅ Middleware to verify Customer role
const verifyCustomer = async (req, res, next) => {
  try {
    const user = await Users.findOne({ uid: req.uid });

    if (!user || user.role !== "customer") {
      return res.status(403).json({ message: "Customer access only", isError: true });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error checking customer role", isError: true });
  }
};


module.exports = { verifyToken, verifyAdmin, verifyCustomer };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Token is sent as: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify signature and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password) for use in later controllers
      req.user = await User.findById(decoded.id).select("-password");

      next(); // proceed to the actual route handler
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const auth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save logged-in user data in request object

    const user = await User.findById(decoded.id).select("-password");

if (!user) {
    return res.status(401).json({
        success: false,
        message: "User not found"
    });
}

req.user = user;

    // Move to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = auth;
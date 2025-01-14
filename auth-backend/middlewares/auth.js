const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the full user object (id and role) for downstream use
    req.user = { id: decoded.id, role: decoded.role };

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;

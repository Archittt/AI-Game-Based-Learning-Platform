const { verifyToken } = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    // decoded contains { userId, role, iat, exp }
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

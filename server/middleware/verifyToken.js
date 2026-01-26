const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    if (!headers || !headers.startsWith("Bearer ")) {
      return res.status(401).json({ message: "token not found" });
    }
    const split = headers.split(" ")[1];
    const decoded = jwt.verify(split, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
};
module.exports = verifyToken
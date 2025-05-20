import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ status: false, message: "unauthorized - no token provided" });
    const decoded = jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (!decoded)
      return res
        .status(401)
        .json({ status: false, message: "unauthorized - Invalid token" });
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

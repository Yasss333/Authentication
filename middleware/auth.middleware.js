import jwt from "jsonwebtoken";

export const isLoggedIn = (req, res, next) => {
  console.log("🔥 isLoggedIn middleware called");
  console.log("Cookies:", req.cookies);

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Auth failed", error: err.message });
  }
};

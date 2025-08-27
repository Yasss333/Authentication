import express from "express";
import { getMe, login, registeruser, verifyUser, logoutUser } from "../Controllers/user.controllers.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registeruser);
router.get("/verify/:token",verifyUser);
router.post("/login",login);
// protect /me route
router.get("/me", isLoggedIn, (req, res) => {
  const data=req.user
  console.log("Reached at Profile level ", data);
  res.json({
    success: true,
    user: req.user,
  });
});
router.get("/logout", isLoggedIn, logoutUser);
router.get("/", (req, res) => {
  res.send("User route works");
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

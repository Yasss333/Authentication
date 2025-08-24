import express from "express";
import { login, registeruser, verifyUser } from "../Controllers/user.controllers.js";

const router = express.Router();

router.post("/register", registeruser);
router.get("/verify/:token",verifyUser);
router.post("/login",login);
router.get("/", (req, res) => {
  res.send("User route works");
});

export default router;

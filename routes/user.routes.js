import express from "express";
import { registeruser } from "../Controllers/user.controllers.js";

const router = express.Router();

router.post("/register", registeruser);
router.get("/", (req, res) => {
  res.send("User route works");
});

export default router;

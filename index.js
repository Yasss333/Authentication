import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";
// Import routes
import userRoutes from "./routes/user.routes.js";

dotenv.config();

// 🔎 Debugging: check if your secret is loading correctly
console.log("ENV JWT_SECRET:", JSON.stringify(process.env.JWT_SECRET));

const app = express();
const port = process.env.PORT || 4000;


app.use(
  cors({
    origin: "http://localhost:3000", // fixed typo
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // allow all
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Test routes
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/yash", (req, res) => res.send("Yash"));


// Connect to DB
db();

// User routes
app.use("/api/v1/users", userRoutes);

// app.listen(port, () => {
  //   console.log(`Example app listening on port ${port}`);
  // });
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
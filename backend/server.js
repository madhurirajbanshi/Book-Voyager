import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config, connectDB } from "./config/config.js";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = config.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.use("/cart", cartRoutes);
    app.use("/orders", orderRoutes);
    app.use("/books", bookRoutes);
    app.use("/auth", authRoutes);
    ~app.use("/favourites", favouriteRoutes);
    app.use("/feedback", feedbackRoutes);
    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Backend entry point
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database.js";
import { router as authRoutes } from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect Mongodb
connectDB();

// Root route
app.use("/api/auth", authRoutes);

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

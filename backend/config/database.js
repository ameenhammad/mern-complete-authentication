// Database configuration
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

export const connectDB = () => {
  console.log(MONGO_URL);
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Mongodb Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

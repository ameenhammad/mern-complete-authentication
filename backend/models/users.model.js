import mongoose from "mongoose";

// User Schema with password reset fields
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    //Added fields for OTP reset
    resetOtp: { type: Number },
    resetOtpExpire: { type: Date },
    tempResetToken: { type: String },
  },
  {
    timestamps: true,
  }
);

export const user = mongoose.model("users", userSchema);

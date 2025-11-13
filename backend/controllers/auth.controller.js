import { user as User } from "../models/users.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    console.log(userAlreadyExists);
    if (userAlreadyExists)
      return res
        .status(400)
        .json({ message: "username or email already exist" });

    const hashPassword = await bcrypt.hash(password, 10);
    const savedUser = await User.create({
      ...req.body,
      password: hashPassword,
    });
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //Generate Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailInfo = await transporter.sendMail({
      from: `Verification Center <${process.env.EMAIL}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Your One-Time Password (OTP) is:</p>

      <h1 style="background: #f5f5f5; padding: 10px; border-radius: 8px;
                 display: inline-block; letter-spacing: 4px;">
        ${otp}
      </h1>

      <p>This OTP is valid for <strong>10 minutes</strong>.</p>

      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>Regards,<br/>Your App Team</p>
    </div>
  `,
    });

    res.json({ message: "OTP sent to email", mailInfo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOtp !== Number(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.resetOtpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const tempToken = Math.random().toString(36).substring(2);

    user.tempResetToken = tempToken;
    await user.save();

    res.json({ message: "OTP verified", tempToken });
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, tempToken, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.tempResetToken !== tempToken)
      return res.status(401).json({ message: "Unauthorized request" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpire = null;
    user.tempResetToken = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent spamming
    if (user.resetOtpExpire && user.resetOtpExpire > Date.now()) {
      return res
        .status(429)
        .json({ message: "OTP already sent. Try again later." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Verification Center <${process.env.EMAIL}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your OTP is:</p>
          <h1 style="background:#f5f5f5;padding:10px;border-radius:8px;display:inline-block;letter-spacing:4px;">
            ${otp}
          </h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

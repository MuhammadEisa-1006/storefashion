import express from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });
  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: genToken(user._id) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: genToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}));

router.get("/me", protect, asyncHandler(async (req, res) => {
  res.json(req.user);
}));

export default router;

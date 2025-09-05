import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products?keyword=&category=&min=&max=&size=&color=&page=&limit=
router.get("/", asyncHandler(async (req, res) => {
  const { keyword, category, min, max, size, color, page = 1, limit = 12 } = req.query;
  const q = {};
  if (keyword) q.name = { $regex: keyword, $options: "i" };
  if (category) q.category = category;
  if (size) q.sizes = { $in: [size] };
  if (color) q.colors = { $in: [color] };
  if (min || max) q.price = { ...(min ? { $gte: Number(min) } : {}), ...(max ? { $lte: Number(max) } : {}) };
  const total = await Product.countDocuments(q);
  const products = await Product.find(q).sort({ createdAt: -1 }).skip((Number(page)-1)*Number(limit)).limit(Number(limit));
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
}));

// Admin CRUD
router.post("/", protect, adminOnly, asyncHandler(async (req, res) => {
  const p = await Product.create(req.body);
  res.status(201).json(p);
}));

router.put("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
}));

router.delete("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}));

export default router;

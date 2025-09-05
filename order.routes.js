import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";
import Stripe from "stripe";

const router = express.Router();

const getStripe = () => {
  const key = process.env.STRIPE_SECRET;
  return key ? new Stripe(key) : null;
};

router.post("/", protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, token } = req.body;
  if (!orderItems?.length) return res.status(400).json({ message: "No order items" });

  // Decrement stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
    }
    product.countInStock -= item.qty;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  });

  const stripe = getStripe();
  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      description: `Order ${order._id.toString()}`,
      payment_method: token,
      confirm: true,
      automatic_payment_methods: { enabled: true }
    });
    order.isPaid = intent.status === "succeeded";
    order.paidAt = order.isPaid ? new Date() : undefined;
    order.paymentResult = { id: intent.id, status: intent.status };
    await order.save();
  } else {
    // Mock payment success if STRIPE_SECRET is not set
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = { id: "mock_payment", status: "succeeded" };
    await order.save();
  }

  res.status(201).json(order);
}));

router.get("/mine", protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

router.get("/", protect, adminOnly, asyncHandler(async (_req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
}));

router.put("/:id/deliver", protect, adminOnly, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();
  res.json(order);
}));

export default router;

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  qty: Number,
  price: Number,
  size: String,
  color: String,
  image: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: String, city: String, postalCode: String, country: String, phone: String
  },
  paymentMethod: { type: String, default: "stripe" },
  paymentResult: { id: String, status: String, update_time: String, email_address: String },
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);

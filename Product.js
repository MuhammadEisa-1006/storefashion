import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: "Generic" },
  category: { type: String, enum: ["men", "women", "kids", "unisex"], default: "unisex" },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  image: { type: String, default: "" }, // URL or /uploads/xxx
  sizes: [{ type: String }],
  colors: [{ type: String }],
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);

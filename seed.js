import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../src/config/db.js";
import Product from "../src/models/Product.js";

await connectDB();

const products = [
  {
    name: "Classic White Tee",
    brand: "EisaWear",
    category: "men",
    description: "Soft cotton, everyday essential",
    price: 15.99,
    image: "/uploads/seed-white-tee.jpg",
    sizes: ["S","M","L","XL"],
    colors: ["white"],
    countInStock: 50,
    rating: 4.4,
    numReviews: 27
  },
  {
    name: "Flowy Summer Dress",
    brand: "EisaWear",
    category: "women",
    description: "Lightweight fabric with floral print",
    price: 39.99,
    image: "/uploads/seed-summer-dress.jpg",
    sizes: ["XS","S","M","L"],
    colors: ["yellow","blue"],
    countInStock: 18,
    rating: 4.7,
    numReviews: 12
  },
  {
    name: "Kids Hoodie",
    brand: "EisaWear",
    category: "kids",
    description: "Cozy fleece for chilly days",
    price: 24.50,
    image: "/uploads/seed-kids-hoodie.jpg",
    sizes: ["3-4","5-6","7-8","9-10"],
    colors: ["red","navy"],
    countInStock: 30,
    rating: 4.5,
    numReviews: 9
  }
];

await Product.deleteMany({});
await Product.insertMany(products);
console.log("Seeded products ✅");
process.exit(0);

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect, adminOnly } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ url: filePath });
});

export default router;

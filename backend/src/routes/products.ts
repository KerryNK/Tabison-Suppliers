import express from "express";
import Product from "../models/Product";

const router = express.Router();

router.get("/", async (req, res) => {
  const { category, material, height } = req.query;
  const filter: any = {};
  if (category) filter.category = category;
  if (material) filter.material = material;
  if (height) filter.height = Number(height);

  const products = await Product.find(filter);
  res.json({ products });
});

export default router; 
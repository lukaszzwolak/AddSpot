import { Router } from "express";
import Ad from "../models/Ad.js";

const r = Router();

r.get("/", async (_req, res) => {
  const items = await Ad.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

r.post("/", async (req, res) => {
  const { title, price, desc } = req.body;
  if (!title || price == null)
    return res.status(400).json({ error: "title and price required" });
  const ad = await Ad.create({ title, price: Number(price), desc });
  res.status(201).json(ad);
});

r.get("/:id", async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) return res.status(404).json({ error: "not found" });
  res.json(ad);
});

r.delete("/:id", async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default r;

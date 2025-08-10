import mongoose from "mongoose";

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  desc: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ad", AdSchema);

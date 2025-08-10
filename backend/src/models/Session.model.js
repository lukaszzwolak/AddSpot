import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  expires: { type: Date, required: true },
  session: { type: String, required: true },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;

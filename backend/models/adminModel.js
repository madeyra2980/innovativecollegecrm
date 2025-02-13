import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  secondName: { type: String, required: true },
  sureName: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
});



export default mongoose.model("Admin", adminSchema);

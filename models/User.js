import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  role: { type: String, default: "Customer", enum: ["Admin", "Customer"] },
});

const User = mongoose.model("User", userSchema);

export default User;

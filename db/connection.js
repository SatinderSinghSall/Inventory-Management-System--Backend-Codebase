import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("🌿 MongoDB database connection successful.");
  } catch (error) {
    console.log(`❌ MongoDB database connection failed: ${error}`);
    process.exit(1);
  }
};

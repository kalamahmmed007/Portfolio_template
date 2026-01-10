import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected 🚀");
  } catch (error) {
    console.error("Mongo error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

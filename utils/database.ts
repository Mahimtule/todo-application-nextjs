import mongoose from "mongoose";

let isConnected = false;
export const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("Mongodb is already connected");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "todo-application",
    });
    console.log("Connected to mongodb");
    isConnected = true;
  } catch (error) {
    console.log("Error Connecting to MongoDB", error);
  }
};

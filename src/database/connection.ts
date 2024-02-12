// src/infrastructure/database.ts
import mongoose from "mongoose";

export const connectToDatabase = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

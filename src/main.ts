import express from "express";
import authRouter from "./presentation/routes/authRoutes";
import { connectToDatabase } from "./database/connection";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("Environment variable MONGO_URI is not set");
}
connectToDatabase(mongoUri)
  .then(() => {
    app.use("/auth", authRouter);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB:", error);
  });

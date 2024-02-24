import dotenv from 'dotenv';
dotenv.config(); 
import express from "express";
import { connectToDatabase } from "./database/connection";
import cors from "cors";
import session from "express-session";
import passport from './external-libraries/passport-google-auth'
import authRouter from "./presentation/routes/authRoutes";
import cookieParser from 'cookie-parser'
import workspaceRouter from './presentation/routes/workspaceRoutes'
import folderRouter from "./presentation/routes/folderRoutes";
import { errorHandler } from './presentation/middleware/errorHandler';
const app = express();     
app.use(express.json());
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.static("src/public"));
app.use(passport.initialize())
const port = process.env.PORT || 5000;  
    
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("Environment variable MONGO_URI is not set");
}
connectToDatabase(mongoUri)
  .then(() => {  
    app.use("/auth", authRouter);
    app.use("/workspace", workspaceRouter);
    app.use("/folder", folderRouter);
    app.use(errorHandler)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB:", error);
  });

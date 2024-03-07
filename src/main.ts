import dotenv from 'dotenv';
dotenv.config(); 
import express from "express";
import { Server } from "socket.io";
import { connectToDatabase } from "./database/connection";
import cors from "cors";
import session from "express-session";
import passport from './external-libraries/passport-google-auth'
import authRouter from "./presentation/routes/authRoutes";
import cookieParser from 'cookie-parser'
import workspaceRouter from './presentation/routes/workspaceRoutes'
import folderRouter from "./presentation/routes/folderRoutes";
import fileRouter from "./presentation/routes/fileRouter";
import { errorHandler } from './presentation/middleware/errorHandler';
import ioMiddleware from './presentation/middleware/socketIo';
const app = express(); 
// socket
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  },
});

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
    io.on("connection", socket => {
      console.log("a user connected");

      // Example: Emit data to the client
      socket.emit("data", { message: "Hello from server!" });

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
    app.use(ioMiddleware(io));
    app.use("/auth", authRouter);
    app.use("/workspace", workspaceRouter);
    app.use("/folder", folderRouter);
    app.use("/file", fileRouter);
    app.use(errorHandler)
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to MongoDB:", error);
  });

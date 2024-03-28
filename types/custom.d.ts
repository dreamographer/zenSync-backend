// custom.d.ts
import { Server } from "socket.io";
declare namespace Express {
  export interface Request {
    io: Server; // Replace 'any' with the actual type of 'io' if known
  }
}

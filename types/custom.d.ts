// custom.d.ts
import { Server } from "socket.io";
declare namespace Express {
  export interface Request {
    io: Server;
  }
}

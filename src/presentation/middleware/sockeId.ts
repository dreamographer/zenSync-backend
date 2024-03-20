

import { Server } from "socket.io";
import { Request, Response, NextFunction } from "express";

const socketIdMiddleWare = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
  };
};

export default socketIdMiddleWare;

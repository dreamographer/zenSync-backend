import { Server } from "socket.io";
import { Request, Response, NextFunction } from "express";

const ioMiddleware = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).io = io;
    next();
  };
};

export default ioMiddleware;

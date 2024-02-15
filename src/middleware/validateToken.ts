import { NextFunction, Response,Request } from "express";
import { Token } from "../external-libraries/Token";

const tokenService = new Token();
//JWT Token Validation
export const validateToken=(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response=> { 
  const authHeader = req.headers.authorization;
  
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = tokenService.verifyToken(token);
    req.user = decodedToken.userId; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Failed to authenticate token" });
  }
}

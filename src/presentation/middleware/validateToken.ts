import { NextFunction, Response, Request } from "express";
import { Token } from "../../external-libraries/Token";

const tokenService = new Token();
//JWT Token Validation
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader?.split(" ")[1] : req.cookies.jwt;
    const refreshToken = authHeader
      ? authHeader?.split(" ")[3]
      : req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decodedToken = tokenService.verifyRefreshToken(refreshToken);
    const userId = decodedToken.userId;

    const { accessToken, refreshToken: newRefreshToken } =
      tokenService.generateTokens(userId);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    req.user = userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Failed to refresh token" });
  }
};

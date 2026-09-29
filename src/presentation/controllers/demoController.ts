import { NextFunction, Request, Response } from "express";
import { IDemoService } from "../../interfaces/IDemoService";

// demo accounts are free to create, so cap how fast one visitor can spawn them
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export class demoController {
  private demoService: IDemoService;
  private requestLog: Map<string, number[]> = new Map();

  constructor(demoService: IDemoService) {
    this.demoService = demoService;
  }

  private isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const recent = (this.requestLog.get(ip) || []).filter(
      timestamp => timestamp > windowStart
    );

    if (recent.length >= RATE_LIMIT_MAX) {
      this.requestLog.set(ip, recent);
      return true;
    }

    recent.push(now);
    this.requestLog.set(ip, recent);

    // drop entries for visitors that have gone quiet
    for (const [key, timestamps] of this.requestLog) {
      if (!timestamps.some(timestamp => timestamp > windowStart)) {
        this.requestLog.delete(key);
      }
    }
    return false;
  }

  async onDemoLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      if (this.isRateLimited(ip)) {
        return res.status(429).json({
          error: "Too many demo sessions from this address. Try again later.",
        });
      }

      // sweep yesterday's demo accounts while we are already here
      this.demoService
        .purgeExpiredDemoUsers()
        .catch(error => console.error("Demo purge failed:", error));

      const user = await this.demoService.createDemoUser();
      if (!user?.id) {
        return res.status(500).json({ error: "Could not start demo session" });
      }

      await this.demoService.seedDemoData(user.id);

      const { accessToken, refreshToken } = this.demoService.generateToken(
        user.id
      );
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Demo session started",
        user: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          profile: user.profile ?? null,
          verified: user.verified,
          isDemo: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

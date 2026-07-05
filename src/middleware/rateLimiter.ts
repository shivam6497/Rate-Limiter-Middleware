import type { Request, Response, NextFunction } from "express";
import redis from "../redis/client.js";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 10;

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const normalizedIp = ip === "::1" ? "127.0.0.1" : ip;
    const key = `rate_limit:${normalizedIp}`;
    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    if (requests > MAX_REQUESTS) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        requestMade: requests,
        limit: MAX_REQUESTS,
      });
      return;
    }

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
    res.setHeader(
      "X-RateLimit-Remaining",
      (MAX_REQUESTS - requests).toString(),
    );

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error in rate limiter.",
    });
  }
};

export default rateLimiter;

// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

// General rate limiter (for all routes)
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,     // 1 minute
  max: 100,                    // limit each IP to 100 requests per minute
  message: { error: "Too many requests" },
});

// Event collection limiter (per API key)
export const collectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  keyGenerator: (req) => {
    const key = req.header("x-api-key");
    return key ? String(key) : String(req.ip);
  },
  message: { error: "Event rate limit exceeded" }
});


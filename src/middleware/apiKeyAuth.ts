// src/middleware/apiKeyAuth.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = String(req.header("x-api-key") || "");

  if (!key) return res.status(401).json({ error: "API key missing" });

  try {
    const apiKey = await prisma.apiKey.findUnique({ where: { key } });
    if (!apiKey) return res.status(403).json({ error: "Invalid API key" });
    if (apiKey.revoked) return res.status(403).json({ error: "API key revoked" });
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return res.status(403).json({ error: "API key expired" });

    // Attach appId for later handlers
    (req as any).appId = apiKey.appId;
    next();
  } catch (err) {
    console.error("apiKeyAuth error:", err);
    return res.status(500).json({ error: "internal error" });
  }
}

// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";
import crypto from "crypto";

export async function registerApp(req: Request, res: Response) {
  try {
    const { name, owner } = req.body || {};
    if (!name || !owner) return res.status(400).json({ error: "name and owner required" });

    const app = await prisma.app.create({ data: { name, owner } });
    const key = crypto.randomBytes(32).toString("hex");

    const apiKey = await prisma.apiKey.create({ data: { key, appId: app.id } });

    return res.status(201).json({ appId: app.id, apiKey: apiKey.key });
  } catch (err) {
    console.error("registerApp error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

export async function getApiKeys(req: Request, res: Response) {
  try {
    const { appId } = req.query;
    if (!appId) return res.status(400).json({ error: "appId required" });
    const keys = await prisma.apiKey.findMany({ where: { appId: String(appId) }, select: { key: true, revoked: true, expiresAt: true, createdAt: true }});
    return res.json(keys);
  } catch (err) {
    console.error("getApiKeys error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

export async function revokeApiKey(req: Request, res: Response) {
  try {
    const { key } = req.body || {};
    if (!key) return res.status(400).json({ error: "key required" });
    const updated = await prisma.apiKey.updateMany({ where: { key }, data: { revoked: true }});
    return res.json({ ok: true, count: updated.count });
  } catch (err) {
    console.error("revokeApiKey error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

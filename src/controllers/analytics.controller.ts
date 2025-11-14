// src/controllers/analytics.controller.ts
import { Request, Response } from "express";
import prisma from "../prisma/client";
import redis from "../redis/redisClient";


export async function collectEvent(req: Request, res: Response) {
  try {
    const appId = (req as any).appId;
    const { event, url, referrer, device, ipAddress, timestamp, metadata, userId } = req.body || {};

    if (!event || !timestamp) return res.status(400).json({ error: "event and timestamp required" });

    const ev = await prisma.event.create({
      data: {
        appId,
        eventType: event,
        url: url || null,
        referrer: referrer || null,
        device: device || null,
        ipAddress: ipAddress || null,
        timestamp: new Date(timestamp),
        metadata: metadata || {},
        userId: userId || null
      }
    });

    return res.status(201).json({ ok: true, id: ev.id });
  } catch (err) {
    console.error("collectEvent error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

export async function eventSummary(req: Request, res: Response) {
  try {
    const { event, startDate, endDate, app_id } = req.query;

    // 🔥 NEW: Generate cache key
    const cacheKey = `summary:${event || "all"}:${app_id || "all"}:${startDate || "none"}:${endDate || "none"}`;

    // 🔥 NEW: Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cached));
    }

    // --- existing logic ---

    const where: any = {};
    if (event) where.eventType = String(event);
    if (app_id) where.appId = String(app_id);
    if (startDate || endDate) where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(String(startDate));
    if (endDate) where.timestamp.lte = new Date(String(endDate));

    const total = await prisma.event.count({ where });

    const uniqueUsersData = await prisma.event.findMany({
      where: {
        ...where,
        userId: { not: null },
      },
      distinct: ["userId"],
      select: { userId: true },
    });

    const uniqueUsers = uniqueUsersData.length;

    const deviceGroup = await prisma.event.groupBy({
      by: ["device"],
      where,
      _count: { device: true },
    });

    const deviceData: Record<string, number> = {};
    deviceGroup.forEach((d: { device: string | null; _count: { device: number } }) => {
      deviceData[d.device ?? "unknown"] = d._count.device;
    });

    const responseData = {
      event: event || "all",
      count: total,
      uniqueUsers,
      deviceData,
    };

    // 🔥 NEW: Save response to Redis (TTL = 60 seconds)
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 60);

    return res.json(responseData);
  } catch (err) {
    console.error("eventSummary error:", err);
    return res.status(500).json({ error: "server error" });
  }
}



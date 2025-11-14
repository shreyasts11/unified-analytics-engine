"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectEvent = collectEvent;
exports.eventSummary = eventSummary;
const client_1 = __importDefault(require("../prisma/client"));
const redisClient_1 = __importDefault(require("../redis/redisClient"));
async function collectEvent(req, res) {
    try {
        const appId = req.appId;
        const { event, url, referrer, device, ipAddress, timestamp, metadata, userId } = req.body || {};
        if (!event || !timestamp)
            return res.status(400).json({ error: "event and timestamp required" });
        const ev = await client_1.default.event.create({
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
    }
    catch (err) {
        console.error("collectEvent error:", err);
        return res.status(500).json({ error: "server error" });
    }
}
async function eventSummary(req, res) {
    try {
        const { event, startDate, endDate, app_id } = req.query;
        // 🔥 NEW: Generate cache key
        const cacheKey = `summary:${event || "all"}:${app_id || "all"}:${startDate || "none"}:${endDate || "none"}`;
        // 🔥 NEW: Check cache
        const cached = await redisClient_1.default.get(cacheKey);
        if (cached) {
            console.log("Serving from cache");
            return res.json(JSON.parse(cached));
        }
        // --- existing logic ---
        const where = {};
        if (event)
            where.eventType = String(event);
        if (app_id)
            where.appId = String(app_id);
        if (startDate || endDate)
            where.timestamp = {};
        if (startDate)
            where.timestamp.gte = new Date(String(startDate));
        if (endDate)
            where.timestamp.lte = new Date(String(endDate));
        const total = await client_1.default.event.count({ where });
        const uniqueUsersData = await client_1.default.event.findMany({
            where: {
                ...where,
                userId: { not: null },
            },
            distinct: ["userId"],
            select: { userId: true },
        });
        const uniqueUsers = uniqueUsersData.length;
        const deviceGroup = await client_1.default.event.groupBy({
            by: ["device"],
            where,
            _count: { device: true },
        });
        const deviceData = {};
        deviceGroup.forEach((d) => {
            deviceData[d.device ?? "unknown"] = d._count.device;
        });
        const responseData = {
            event: event || "all",
            count: total,
            uniqueUsers,
            deviceData,
        };
        // 🔥 NEW: Save response to Redis (TTL = 60 seconds)
        await redisClient_1.default.set(cacheKey, JSON.stringify(responseData), "EX", 60);
        return res.json(responseData);
    }
    catch (err) {
        console.error("eventSummary error:", err);
        return res.status(500).json({ error: "server error" });
    }
}

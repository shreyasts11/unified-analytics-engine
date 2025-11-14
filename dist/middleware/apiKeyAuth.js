"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = apiKeyAuth;
const client_1 = __importDefault(require("../prisma/client"));
async function apiKeyAuth(req, res, next) {
    const key = String(req.header("x-api-key") || "");
    if (!key)
        return res.status(401).json({ error: "API key missing" });
    try {
        const apiKey = await client_1.default.apiKey.findUnique({ where: { key } });
        if (!apiKey)
            return res.status(403).json({ error: "Invalid API key" });
        if (apiKey.revoked)
            return res.status(403).json({ error: "API key revoked" });
        if (apiKey.expiresAt && apiKey.expiresAt < new Date())
            return res.status(403).json({ error: "API key expired" });
        // Attach appId for later handlers
        req.appId = apiKey.appId;
        next();
    }
    catch (err) {
        console.error("apiKeyAuth error:", err);
        return res.status(500).json({ error: "internal error" });
    }
}

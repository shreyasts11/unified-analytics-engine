"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApp = registerApp;
exports.getApiKeys = getApiKeys;
exports.revokeApiKey = revokeApiKey;
const client_1 = __importDefault(require("../prisma/client"));
const crypto_1 = __importDefault(require("crypto"));
async function registerApp(req, res) {
    try {
        const { name, owner } = req.body || {};
        if (!name || !owner)
            return res.status(400).json({ error: "name and owner required" });
        const app = await client_1.default.app.create({ data: { name, owner } });
        const key = crypto_1.default.randomBytes(32).toString("hex");
        const apiKey = await client_1.default.apiKey.create({ data: { key, appId: app.id } });
        return res.status(201).json({ appId: app.id, apiKey: apiKey.key });
    }
    catch (err) {
        console.error("registerApp error:", err);
        return res.status(500).json({ error: "server error" });
    }
}
async function getApiKeys(req, res) {
    try {
        const { appId } = req.query;
        if (!appId)
            return res.status(400).json({ error: "appId required" });
        const keys = await client_1.default.apiKey.findMany({ where: { appId: String(appId) }, select: { key: true, revoked: true, expiresAt: true, createdAt: true } });
        return res.json(keys);
    }
    catch (err) {
        console.error("getApiKeys error:", err);
        return res.status(500).json({ error: "server error" });
    }
}
async function revokeApiKey(req, res) {
    try {
        const { key } = req.body || {};
        if (!key)
            return res.status(400).json({ error: "key required" });
        const updated = await client_1.default.apiKey.updateMany({ where: { key }, data: { revoked: true } });
        return res.json({ ok: true, count: updated.count });
    }
    catch (err) {
        console.error("revokeApiKey error:", err);
        return res.status(500).json({ error: "server error" });
    }
}

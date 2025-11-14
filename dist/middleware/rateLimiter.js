"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectLimiter = exports.generalLimiter = void 0;
// src/middleware/rateLimiter.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General rate limiter (for all routes)
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per minute
    message: { error: "Too many requests" },
});
// Event collection limiter (per API key)
exports.collectLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 300,
    keyGenerator: (req) => {
        const key = req.header("x-api-key");
        return key ? String(key) : String(req.ip);
    },
    message: { error: "Event rate limit exceeded" }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API key management
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new website/app and generate an API key
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               owner:
 *                 type: string
 *     responses:
 *       201:
 *         description: App registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", auth_controller_1.registerApp);
/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Retrieve all API keys for an app
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: API keys fetched successfully
 */
router.get("/api-key", auth_controller_1.getApiKeys);
/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revoke an existing API key
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key revoked
 */
router.post("/revoke", auth_controller_1.revokeApiKey);
exports.default = router;

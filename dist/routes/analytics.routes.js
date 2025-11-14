"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/analytics.routes.ts
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Event collection and reporting
 */
/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collect analytics event
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *               url:
 *                 type: string
 *               referrer:
 *                 type: string
 *               device:
 *                 type: string
 *               ipAddress:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Event collected successfully
 *       401:
 *         description: Invalid API key
 */
router.post("/collect", apiKeyAuth_1.apiKeyAuth, analytics_controller_1.collectEvent);
/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Get summary of events
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event summary response
 */
router.get("/event-summary", analytics_controller_1.eventSummary);
exports.default = router;

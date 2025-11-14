"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Unified Event Analytics Engine API",
            version: "1.0.0",
            description: "API documentation for the analytics backend",
        },
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    // IMPORTANT: absolute path to route files
    apis: [path_1.default.join(process.cwd(), "src/routes/*.ts")],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);

import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Unified Event Analytics Engine API",
      version: "1.0.0",
      description: "API documentation for the analytics backend",
    },
    servers: [
      { url: "https://unified-analytics-engine-production.up.railway.app",
    description: "Production Server", }
    ],
  },

  // IMPORTANT: absolute path to route files
  apis: [path.join(process.cwd(), "src/routes/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);

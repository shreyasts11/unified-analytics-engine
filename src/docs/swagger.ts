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
      {
        url: "https://unified-analytics-engine-production.up.railway.app",
        description: "Production Server",
      },
    ],
  },

  apis: [
    path.join(process.cwd(), "src/routes/*.ts"),  // local
    path.join(process.cwd(), "src/controllers/*.ts"),

    path.join(process.cwd(), "dist/routes/*.js"), // production
    path.join(process.cwd(), "dist/controllers/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

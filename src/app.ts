
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

import authRoutes from "./routes/auth.routes";
import analyticsRoutes from "./routes/analytics.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Analytics Engine API is running" });
});

export default app;

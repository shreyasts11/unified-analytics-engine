"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Analytics Engine API is running" });
});
exports.default = app;

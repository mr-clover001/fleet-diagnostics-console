import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import { swaggerSpec } from "./config/swagger";
import apiRoutes from "./routes/index";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middleware/errorMilddlerware";

dotenv.config();

const app: Application = express();

//  Core Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json({ limit: "5mb" })); // Parse JSON bodies (5mb for log uploads)
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

//  API Docs - Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

// Routes
app.use("/api", apiRoutes);

// Error Handlers (must be LAST in middleware chain)
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

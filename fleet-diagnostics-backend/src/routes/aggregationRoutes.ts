import { Router } from "express";
import { aggregationController } from "../controllers/aggregationController";
import { validateQuery } from "../middleware/validateMiddleware";
import { AggregationQuerySchema } from "../utils/validation";

const router = Router();

/**
 * @swagger
 * /api/aggregations/by-vehicle:
 *   get:
 *     summary: Get event counts grouped by vehicle
 *     tags: [Aggregations]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of time range (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of time range (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Max number of vehicles to return
 *     responses:
 *       200:
 *         description: Event counts grouped by vehicle
 *       400:
 *         description: Invalid query parameters
 */
router.get(
  "/by-vehicle",
  validateQuery(AggregationQuerySchema),
  aggregationController.getByVehicle,
);

/**
 * @swagger
 * /api/aggregations/by-code:
 *   get:
 *     summary: Get most frequent error codes
 *     tags: [Aggregations]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of time range (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of time range (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Max number of codes to return
 *     responses:
 *       200:
 *         description: Most frequent error codes
 *       400:
 *         description: Invalid query parameters
 */
router.get(
  "/by-code",
  validateQuery(AggregationQuerySchema),
  aggregationController.getByCode,
);

/**
 * @swagger
 * /api/aggregations/critical:
 *   get:
 *     summary: Get vehicles currently in critical state
 *     tags: [Aggregations]
 *     description: >
 *       A vehicle is considered CRITICAL if it has 3 or more ERROR events
 *       within the last 1 hour.
 *     responses:
 *       200:
 *         description: List of critical vehicles
 */
router.get("/critical", aggregationController.getCriticalVehicles);

export default router;

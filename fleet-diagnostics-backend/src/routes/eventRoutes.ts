import { Router } from "express";
import { eventController } from "../controllers/eventController";
import { validateQuery } from "../middleware/validateMiddleware";
import { EventQuerySchema } from "../utils/validation";

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get diagnostic events with optional filters
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string }
 *       - in: query
 *         name: code
 *         schema: { type: string }
 *       - in: query
 *         name: level
 *         schema: { type: string, enum: [ERROR, WARN, INFO] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Paginated list of events
 *       400:
 *         description: Invalid query parameters
 */
router.get("/", validateQuery(EventQuerySchema), eventController.getEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Single event object
 *       404:
 *         description: Event not found
 */
router.get("/:id", eventController.getEventById);

// /**
//  * @swagger
//  * /api/events/ingest:
//  *   post:
//  *     summary: Ingest raw log content
//  *     tags: [Events]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               content:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Events ingested successfully
//  */
// // router.post( "/ingest", eventController.ingestLog );

export default router;

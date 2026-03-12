import { Request, Response, NextFunction } from "express";
import { eventService } from "../services/eventService";
import { sendSuccess, sendError } from "../utils/responseHelper";
import { EventQuery } from "../utils/validation";

export const eventController = {
  // GET /api/events
  async getEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = (req as any).validatedQuery as EventQuery;
      const result = await eventService.getEvents(filters);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/events/:id
  async getEventById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idParam = req.params.id;
      const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        sendError(res, "Event ID must be a valid integer", 400);
        return;
      }

      const event = await eventService.getEventById(id);

      if (!event) {
        sendError(res, `Event with ID ${id} not found`, 404);
        return;
      }

      sendSuccess(res, event);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/events/ingest  (body: { content: string })
  async ingestLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        sendError(res, "`content` (string) is required in request body", 400);
        return;
      }

      const result = await eventService.ingestLogContent(content);
      sendSuccess(res, result, 201, `Ingested ${result.inserted} events`);
    } catch (err) {
      next(err);
    }
  },
};

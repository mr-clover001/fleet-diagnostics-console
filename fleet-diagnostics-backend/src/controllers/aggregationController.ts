import { Request, Response, NextFunction } from "express";
import { aggregationService } from "../services/aggregationService";
import { sendSuccess } from "../utils/responseHelper";

export const aggregationController = {
  async getByVehicle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      //  Use validatedQuery instead of req.query
      const { from, to, limit } = (req as any).validatedQuery ?? {};
      const data = await aggregationService.getByVehicle(from, to, limit);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getByCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      //  Use validatedQuery instead of req.query
      const { from, to, limit } = (req as any).validatedQuery ?? {};
      const data = await aggregationService.getByCode(from, to, limit);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getCriticalVehicles(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // No query params needed for critical
      const data = await aggregationService.getCriticalVehicles();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },
};

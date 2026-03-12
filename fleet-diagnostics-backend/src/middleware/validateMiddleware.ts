import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// Generic middleware factory — pass any Zod schema
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const formatted = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: formatted,
      });
      return;
    }

    // Attach parsed + coerced query to request
    (req as any).validatedQuery = result.data;
    next();
  };
}

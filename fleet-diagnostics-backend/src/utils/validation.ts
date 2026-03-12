import { z } from "zod";
import { EventLevel } from "../types";

//  Event Query Params Schema
export const EventQuerySchema = z
  .object({
    vehicleId: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    level: z.nativeEnum(EventLevel).optional(),
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return new Date(data.from) <= new Date(data.to);
      }
      return true;
    },
    { message: "`from` must be before or equal to `to`", path: ["from"] },
  );

// Aggregation Query Params Schema
export const AggregationQuerySchema = z.object({
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type EventQuery = z.infer<typeof EventQuerySchema>;
export type AggregationQuery = z.infer<typeof AggregationQuerySchema>;

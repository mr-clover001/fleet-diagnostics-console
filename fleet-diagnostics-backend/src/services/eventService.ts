import { eventRepository } from "../repositories/eventRepository";
import { parseLogContent } from "../parser/logParser";
import { DiagnosticEvent, EventFilters, PaginatedResult } from "../types";

export const eventService = {
  async getEvents(
    filters: EventFilters,
  ): Promise<PaginatedResult<DiagnosticEvent>> {
    return eventRepository.findMany(filters);
  },

  // Get a single event by ID
  async getEventById(id: number): Promise<DiagnosticEvent | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw Object.assign(new Error("Invalid event ID"), { statusCode: 400 });
    }
    return eventRepository.findById(id);
  },

  // Ingest raw log content string
  async ingestLogContent(content: string): Promise<{
    inserted: number;
    skipped: number;
    errors: number;
  }> {
    const { parsed, skipped, errors } = parseLogContent(content);

    if (parsed.length === 0) {
      return { inserted: 0, skipped, errors: errors.length };
    }

    const inserted = eventRepository.insertMany(parsed);
    return { inserted, skipped, errors: errors.length };
  },

  // Get total count
  async getTotalCount(): Promise<number> {
    return eventRepository.count();
  },
};

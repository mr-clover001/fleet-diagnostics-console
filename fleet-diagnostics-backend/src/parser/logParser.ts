import { DiagnosticEvent, EventLevel } from "../types";

//  Regex
// Matches: [2025-07-24 14:21:08] [VEHICLE_ID:1234] [ERROR] [CODE:U0420] [msg]
const LOG_LINE_REGEX =
  /^\[(.+?)\]\s+\[VEHICLE_ID:(.+?)\]\s+\[(ERROR|WARN|INFO)\]\s+\[CODE:(.+?)\]\s+\[(.+?)\]$/;

const VALID_LEVELS = new Set<string>(["ERROR", "WARN", "INFO"]);

//  Single line parser
export type ParsedEvent = Omit<DiagnosticEvent, "id" | "createdAt">;

export function parseLogLine(line: string): ParsedEvent | null {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) return null; // Skip blank/comments

  const match = trimmed.match(LOG_LINE_REGEX);
  if (!match) return null;

  const [, rawTimestamp, vehicleId, level, code, message] = match;

  // Validate timestamp is parseable
  const parsedDate = new Date(rawTimestamp);
  if (isNaN(parsedDate.getTime())) return null;

  // Validate level
  if (!VALID_LEVELS.has(level)) return null;

  return {
    timestamp: parsedDate.toISOString(),
    vehicleId: vehicleId.trim(),
    level: level as EventLevel,
    code: code.trim().toUpperCase(),
    message: message.trim(),
  };
}

//  Multi-line file parser
export interface ParseResult {
  parsed: ParsedEvent[];
  skipped: number;
  errors: Array<{ line: number; raw: string; reason: string }>;
}

export function parseLogContent(content: string): ParseResult {
  const lines = content.split("\n");
  const parsed: ParsedEvent[] = [];
  const errors: ParseResult["errors"] = [];
  let skipped = 0;

  lines.forEach((line, index) => {
    if (!line.trim() || line.trim().startsWith("#")) {
      skipped++;
      return;
    }

    const result = parseLogLine(line);

    if (result) {
      parsed.push(result);
    } else {
      errors.push({
        line: index + 1,
        raw: line,
        reason: "Does not match expected log format",
      });
    }
  });

  return { parsed, skipped, errors };
}

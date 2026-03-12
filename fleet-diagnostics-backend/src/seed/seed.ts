import { getDatabase } from "../config/database";
import { parseLogContent } from "../parser/logParser";
import { eventRepository } from "../repositories/eventRepository";
import * as fs from "fs";
import * as path from "path";

export async function seedDatabase() {
  try {
    console.log(" Starting database seed...");

    // Read the log file
    const logFilePath = path.join(__dirname, "seed_logs.txt");

    if (!fs.existsSync(logFilePath)) {
      console.error(` Log file not found at ${logFilePath}`);
      return;
    }

    const content = fs.readFileSync(logFilePath, "utf-8");
    console.log(` Read ${content.split("\n").length} lines from log file`);

    // Parse logs
    const parseResult = parseLogContent(content);
    console.log(`Parsed ${parseResult.parsed.length} events`);

    if (parseResult.skipped > 0) {
      console.warn(` Skipped ${parseResult.skipped} lines`);
    }

    if (parseResult.errors.length > 0) {
      console.warn(` Errors parsing ${parseResult.errors.length} lines`);
      parseResult.errors.slice(0, 5).forEach((err) => {
        console.warn(`   Line ${err.line}: ${err.reason}`);
      });
    }

    // Insert into database
    let inserted = 0;
    for (const event of parseResult.parsed) {
      try {
        eventRepository.insert(event);
        inserted++;
      } catch (error) {
        console.error(`Failed to insert event:`, error);
      }
    }

    console.log(` Successfully seeded ${inserted} events into database`);
  } catch (error) {
    console.error(" Error seeding database:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log(" Seed complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

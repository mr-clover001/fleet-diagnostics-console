import app from "./app";
import { getDatabase } from "./config/database";
import { closeDatabase } from "./config/database";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

// Initialize DB before starting server
getDatabase();

const server = app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Swagger docs at http://localhost:${PORT}/api-docs`);
});

// Graceful Shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    closeDatabase();
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

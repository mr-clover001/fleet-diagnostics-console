import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fleet Diagnostics API",
      version: "1.0.0",
      description:
        "REST API for the Connected Fleet Health & Diagnostics Console",
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" },
    ],
    tags: [
      { name: "Events", description: "Diagnostic event endpoints" },
      { name: "Aggregations", description: "Aggregated analytics endpoints" },
    ],
  },
  apis: ["./src/routes/*.ts"], // Pick up @swagger JSDoc comments
};

export const swaggerSpec = swaggerJsdoc(options);

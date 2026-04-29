import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Farm API",
      version: "1.0.0",
      description: "API documentation for the Smart Farm IoT system",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
  },
  // Tự động quét các file có đuôi .swagger.ts trong thư mục modules
  apis: ["./src/modules/**/*.swagger.ts", "./src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

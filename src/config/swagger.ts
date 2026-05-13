import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Farm API',
            version: '1.0.0',
            description: 'API documentation for the Smart Farm IoT system',
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Nhập token: Bearer <your_token_here>',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.swagger.ts', './src/modules/**/*.route.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

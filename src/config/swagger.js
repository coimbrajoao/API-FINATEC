const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const basicAuth = require('../middleware/authenticationMiddleware');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Finatec API',
            version: '1.0.0',
            description: 'Documentação da API da Finatec',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: 'User',
                description: 'Rotas relacionadas ao usuário',
            },
            {
                name: 'Auth',
                description: 'Rotas relacionadas ao autenticação',
            }
        ],

    },
    apis: ["src/docs/*.yaml"]
};

const swaggerSpec = swaggerJSDoc(options);

function steupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = steupSwagger;
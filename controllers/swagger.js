'use strict';
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Zimconnect Endpoints',
      version: '1.0.0'
    }
  },
  apis: ['./controllers/health.js'],
};

/**
 * @swagger
 * /health:
 *    get:
 *      description: Get health
 *      responses:
 *        200:
 *          description: Success
 */

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;
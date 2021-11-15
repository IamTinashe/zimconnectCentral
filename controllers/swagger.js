'use strict';
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Zimconnect Endpoints',
      version: '1.0.0',
      contact: {
        name: "API Support",
        url: "https://www.zimconnect.org/contact",
        email: "tinashe.zvihwati@zimworx.com",
      },
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Zimconnect API Documentation",
    },
  ],
  apis: ['./controllers/health.js', './controllers/users.js', './controllers/resumes.js', './controllers/auth.js',],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;
'use strict';
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    components: {},
    info: {
      title: 'WorXconnect Endpoints',
      version: '1.0.0',
      contact: {
        name: "API Support",
        url: "https://www.worxconnect.com/contact",
        email: "tinashe.zvihwati@zimworx.com",
      },
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "WorXconnect API Documentation",
    },
  ],
  apis: ['./controllers/health.js', './controllers/users.js', './controllers/resumes.js', './controllers/auth.js',],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;
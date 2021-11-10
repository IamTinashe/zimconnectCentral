'use strict';
const healthController = require('./health');
const resumeController = require('./resumes');
const usersController = require('./users');
const express = require('express');
const app = express();


app.use('/', healthController.health);
app.use('/resumes', resumeController.all);
app.use('/resumes', resumeController.computed);
app.use('/users', usersController.all);

module.exports = app;

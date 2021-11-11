'use strict';
const express = require('express');
const bodyParser = require('body-parser');


const healthController = require('./health');
const resumeController = require('./resumes');
const usersController = require('./users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/', healthController.health);
app.use('/resumes', resumeController.all);
app.use('/resumes', resumeController.computed);


app.use('/users', usersController.all);
app.use('/users', usersController.create);
app.use('/users', usersController.delete);

module.exports = app;

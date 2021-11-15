'use strict';
const express = require('express');
const bodyParser = require('body-parser');


const Health = require('./health');
const Resumes = require('./resumes');
const Users = require('./users');
const Swagger = require('./swagger');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/', Health);
app.use('/resumes', Resumes);
app.use('/users', Users);
app.use('/swagger-ui', Swagger);

module.exports = app;

'use strict';
require('dotenv').config();
const express = require('express');
const Controllers = require('./controllers');


const app = express();
const port = 4000;
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use('/', Controllers);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
'use strict';
const express = require('express');
const Controllers = require('./controllers');


const app = express();
const port = 3000;

app.use('/', Controllers);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
'use strict';
const express = require('express');
const Services = require('./services');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  let services = new Services();
  try {
    let data = await services.compute();
    return res.send(data);
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
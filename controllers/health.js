'use strict';
const express = require('express');
const app = express();

exports.health = app.get('/health', async (req, res) => {
  return res.send({ 'healthy': true });
});

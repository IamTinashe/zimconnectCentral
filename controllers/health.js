'use strict';
const express = require('express');
const app = express();

exports.health = app.get('/health', async (req, res) => {
  return res.status(200).json({ 'healthy': true });
});

'use strict';
const express = require('express');
const Models = require('../models');
const app = express();

exports.all = app.get('/all', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUsers();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});
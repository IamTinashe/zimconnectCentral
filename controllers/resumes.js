'use strict';
const express = require('express');
const Resumes = require('../services/resumes');
const Services = require('../services');
const app = express();

exports.all = app.get('/all', async (req, res) => {
  let resumes = new Resumes();
  try {
    let data = await resumes.getResumes();
    return res.send(data);
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
});


exports.computed = app.get('/computed', async (req, res) => {
  let services = new Services();
  try {
    return res.send(await services.compute());
  } catch (error) {
    res.status(500);
    return res.send(error);
  }
});